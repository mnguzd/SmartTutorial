using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Services.Interfaces;

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