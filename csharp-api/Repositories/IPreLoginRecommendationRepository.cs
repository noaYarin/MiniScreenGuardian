using ScreenGuardianAPI.Models;

namespace ScreenGuardianAPI.Repositories
{
    public interface IPreLoginRecommendationRepository
    {
        PreLoginRecommendation? GetRecommendationByAge(int age);
    }
}