<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        
        // Check if user has premium subscription for analytics access
        if (!$user->isPremium()) {
            return response()->json([
                'message' => 'Analytics is a Premium feature. Upgrade to access detailed insights.',
                'requires_premium' => true,
                'feature' => 'analytics'
            ], 403);
        }
        
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);

        $analytics = [
            'overview' => $this->getOverviewStats($user, $startDate),
            'productivity' => $this->getProductivityStats($user, $startDate),
            'trends' => $this->getTrendData($user, $startDate),
            'categories' => $this->getCategoryBreakdown($user, $startDate),
            'time_analysis' => $this->getTimeAnalysis($user, $startDate),
            'goals' => $this->getGoalProgress($user, $startDate),
        ];

        return response()->json($analytics);
    }

    private function getOverviewStats($user, $startDate)
    {
        $tasks = $user->tasks();
        
        return [
            'total_tasks' => $tasks->count(),
            'completed_tasks' => $tasks->where('status', 'done')->count(),
            'pending_tasks' => $tasks->where('status', '!=', 'done')->count(),
            'overdue_tasks' => $tasks->where('due_at', '<', now())
                                   ->where('status', '!=', 'done')->count(),
            'completion_rate' => $this->calculateCompletionRate($user, $startDate),
            'avg_completion_time' => $this->getAverageCompletionTime($user, $startDate),
            'productivity_score' => $this->calculateProductivityScore($user, $startDate),
        ];
    }

    private function getProductivityStats($user, $startDate)
    {
        return [
            'daily_average' => $this->getDailyAverage($user, $startDate),
            'best_day' => $this->getBestPerformanceDay($user, $startDate),
            'current_streak' => $this->getCurrentStreak($user),
            'longest_streak' => $this->getLongestStreak($user),
            'weekly_pattern' => $this->getWeeklyPattern($user, $startDate),
            'peak_hours' => $this->getPeakHours($user, $startDate),
        ];
    }

    private function getTrendData($user, $startDate)
    {
        $dailyData = TaskEvent::where('user_id', $user->id)
            ->where('occurred_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(occurred_at) as date'),
                DB::raw('COUNT(CASE WHEN event_type = "created" THEN 1 END) as created'),
                DB::raw('COUNT(CASE WHEN event_type = "completed" THEN 1 END) as completed')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'daily_completion' => $dailyData,
            'weekly_summary' => $this->getWeeklySummary($user, $startDate),
            'monthly_comparison' => $this->getMonthlyComparison($user),
        ];
    }

    private function getCategoryBreakdown($user, $startDate)
    {
        if (!$user->can_use_categories) {
            return ['message' => 'Categories are a Premium feature'];
        }

        $categoryStats = $user->tasks()
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('category')
            ->select('category')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('COUNT(CASE WHEN status = "done" THEN 1 END) as completed')
            ->groupBy('category')
            ->get();

        return [
            'breakdown' => $categoryStats,
            'most_productive_category' => $this->getMostProductiveCategory($user, $startDate),
            'category_trends' => $this->getCategoryTrends($user, $startDate),
        ];
    }

    private function getTimeAnalysis($user, $startDate)
    {
        // This would integrate with your time tracking feature
        return [
            'total_time_tracked' => $this->getTotalTimeTracked($user, $startDate),
            'average_task_duration' => $this->getAverageTaskDuration($user, $startDate),
            'time_by_category' => $this->getTimeByCategory($user, $startDate),
            'efficiency_score' => $this->calculateEfficiencyScore($user, $startDate),
        ];
    }

    private function getGoalProgress($user, $startDate)
    {
        $weeklyGoal = 20; // Default weekly task completion goal
        $currentWeekCompleted = $user->tasks()
            ->where('status', 'done')
            ->where('updated_at', '>=', Carbon::now()->startOfWeek())
            ->count();

        return [
            'weekly_goal' => $weeklyGoal,
            'weekly_progress' => $currentWeekCompleted,
            'weekly_percentage' => min(100, ($currentWeekCompleted / $weeklyGoal) * 100),
            'on_track' => $currentWeekCompleted >= ($weeklyGoal * (Carbon::now()->dayOfWeek / 7)),
            'projected_completion' => $this->getProjectedWeeklyCompletion($user),
        ];
    }

    // Helper methods
    private function calculateCompletionRate($user, $startDate)
    {
        $totalTasks = $user->tasks()->where('created_at', '>=', $startDate)->count();
        $completedTasks = $user->tasks()
            ->where('created_at', '>=', $startDate)
            ->where('status', 'done')
            ->count();

        return $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0;
    }

    private function calculateProductivityScore($user, $startDate)
    {
        $completionRate = $this->calculateCompletionRate($user, $startDate);
        $onTimeRate = $this->getOnTimeCompletionRate($user, $startDate);
        $consistencyScore = $this->getConsistencyScore($user, $startDate);

        return round(($completionRate * 0.4) + ($onTimeRate * 0.4) + ($consistencyScore * 0.2), 1);
    }

    private function getOnTimeCompletionRate($user, $startDate)
    {
        $tasksWithDueDate = $user->tasks()
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('due_at')
            ->where('status', 'done')
            ->count();

        $onTimeTasks = TaskEvent::where('user_id', $user->id)
            ->where('event_type', 'completed')
            ->where('occurred_at', '>=', $startDate)
            ->whereHas('task', function($query) {
                $query->whereRaw('occurred_at <= due_at');
            })
            ->count();

        return $tasksWithDueDate > 0 ? round(($onTimeTasks / $tasksWithDueDate) * 100, 1) : 0;
    }

    private function getConsistencyScore($user, $startDate)
    {
        $dailyCompletions = TaskEvent::where('user_id', $user->id)
            ->where('event_type', 'completed')
            ->where('occurred_at', '>=', $startDate)
            ->select(DB::raw('DATE(occurred_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->pluck('count')
            ->toArray();

        if (empty($dailyCompletions)) return 0;

        $mean = array_sum($dailyCompletions) / count($dailyCompletions);
        $variance = array_sum(array_map(function($x) use ($mean) { return pow($x - $mean, 2); }, $dailyCompletions)) / count($dailyCompletions);
        $standardDeviation = sqrt($variance);

        // Lower standard deviation = higher consistency
        return max(0, 100 - ($standardDeviation * 10));
    }

    private function getCurrentStreak($user)
    {
        $streak = 0;
        $currentDate = Carbon::now()->startOfDay();

        while (true) {
            $hasActivity = TaskEvent::where('user_id', $user->id)
                ->where('event_type', 'completed')
                ->whereDate('occurred_at', $currentDate)
                ->exists();

            if (!$hasActivity) break;

            $streak++;
            $currentDate->subDay();
        }

        return $streak;
    }

    private function getLongestStreak($user)
    {
        // This would require more complex logic to calculate historical streaks
        // For now, return current streak as placeholder
        return $this->getCurrentStreak($user);
    }

    // Additional helper methods would go here...
    private function getDailyAverage($user, $startDate) { return 0; }
    private function getBestPerformanceDay($user, $startDate) { return null; }
    private function getWeeklyPattern($user, $startDate) { return []; }
    private function getPeakHours($user, $startDate) { return []; }
    private function getWeeklySummary($user, $startDate) { return []; }
    private function getMonthlyComparison($user) { return []; }
    private function getMostProductiveCategory($user, $startDate) { return null; }
    private function getCategoryTrends($user, $startDate) { return []; }
    private function getTotalTimeTracked($user, $startDate) { return 0; }
    private function getAverageTaskDuration($user, $startDate) { return 0; }
    private function getTimeByCategory($user, $startDate) { return []; }
    private function calculateEfficiencyScore($user, $startDate) { return 0; }
    private function getProjectedWeeklyCompletion($user) { return 0; }
    private function getAverageCompletionTime($user, $startDate) { return 0; }
}
