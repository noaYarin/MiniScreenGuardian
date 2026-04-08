using Microsoft.Data.SqlClient;
using ScreenGuardianAPI.Models;
using System.Data;

namespace ScreenGuardianAPI.Repositories
{
    public class PreLoginRecommendationRepository : IPreLoginRecommendationRepository
    {
        private readonly string connectionString;

        public PreLoginRecommendationRepository(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public PreLoginRecommendation GetRecommendationByAge(int age)
        {
            PreLoginRecommendation recommendation = null;

            SqlConnection con = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand("SP_SG_GetPreLoginRecommendationByAge", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@age", age);

            con.Open();

            SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                recommendation = new PreLoginRecommendation();

                recommendation.Id = Convert.ToInt32(reader["id"]);
                recommendation.MinAge = Convert.ToInt32(reader["minAge"]);
                recommendation.MaxAge = Convert.ToInt32(reader["maxAge"]);
                recommendation.RecommendedMinutes = Convert.ToInt32(reader["recommendedMinutes"]);
                recommendation.Message = reader["message"].ToString();
            }

            reader.Close();
            con.Close();

            return recommendation;
        }
    }
}