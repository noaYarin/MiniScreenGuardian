using Microsoft.AspNetCore.Mvc;
using ScreenGuardianAPI.Models;
using ScreenGuardianAPI.Repositories;

namespace ScreenGuardianAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreLoginRecommendationController : ControllerBase
    {
        private readonly IPreLoginRecommendationRepository repository;

        public PreLoginRecommendationController(IPreLoginRecommendationRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet("recommendation")]
        public ActionResult<PreLoginRecommendation> GetRecommendation([FromQuery] int? age)
        {
            try
            {
                if (age == null)
                {
                    return BadRequest("Age is required.");
                }

                if (age < 6 || age > 17)
                {
                    return BadRequest("Age must be between 6 and 17.");
                }

                PreLoginRecommendation? recommendation = repository.GetRecommendationByAge(age.Value);

                if (recommendation == null)
                {
                    return NotFound("No recommendation found for this age.");
                }

                return Ok(recommendation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}