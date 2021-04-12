using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.Domain;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IGenericRepository<Subject> _repository;

        public WeatherForecastController(IGenericRepository<Subject> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok();
        }
    }
}
