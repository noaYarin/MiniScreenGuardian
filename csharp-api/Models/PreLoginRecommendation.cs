namespace ScreenGuardianAPI.Models
{
    public class PreLoginRecommendation
    {
        public int Id { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public int RecommendedMinutes { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}