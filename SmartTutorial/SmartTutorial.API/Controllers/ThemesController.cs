using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.PaginationDtos.ThemesDtos;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThemesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IThemeService _themeService;

        public ThemesController(IThemeService subjectService, IMapper mapper)
        {
            _themeService = subjectService;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var themeList = await _themeService.GetAll();
            var themeDtoList = _mapper.Map<List<ThemeDto>>(themeList);
            return Ok(themeDtoList);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("getPaginated")]
        public async Task<IActionResult> Get([FromQuery]ThemeParameters parameters)
        {
            var themeList = await _themeService.GetPaginated(parameters);
            var themeDtoList = _mapper.Map<List<ThemeDto>>(themeList);
            return Ok(themeDtoList);
        }

        [AllowAnonymous]
        [HttpGet("{themeId:int}")]
        public async Task<IActionResult> Get(int themeId)
        {
            var theme = await _themeService.GetWithInclude(themeId);
            if (theme == null)
            {
                return NotFound();
            }

            var themeDto = _mapper.Map<ThemeWithSubjectsDto>(theme);
            return Ok(themeDto);
        }
    }
}