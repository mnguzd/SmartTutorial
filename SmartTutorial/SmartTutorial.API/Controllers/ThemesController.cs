using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Services.Interfaces;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThemesController : ControllerBase
    {
        private readonly IThemeService _themeService;

        public ThemesController(IThemeService subjectService)
        {
            _themeService = subjectService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var themeList = await _themeService.GetAll();
            return Ok(themeList);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("getPaginated")]
        public async Task<IActionResult> Get(PagedRequest request)
        {
            var themeList = await _themeService.GetPaginated(request);
            return Ok(themeList);
        }

        [AllowAnonymous]
        [HttpGet("{themeId:int}")]
        public async Task<IActionResult> Get(int themeId)
        {
            var theme = await _themeService.GetWithInclude(themeId);
            return Ok(theme);
        }
    }
}