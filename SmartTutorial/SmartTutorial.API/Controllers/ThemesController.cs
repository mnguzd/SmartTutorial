using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThemesController : ControllerBase
    {
        private readonly IThemeService _themeService;
        private readonly IMapper _mapper;

        public ThemesController(IThemeService subjectService, IMapper mapper)
        {
            _themeService = subjectService;
            _mapper = mapper;
        }
        // GET: api/<ThemesController>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var themeList = await _themeService.GetAll();
            var themeDtoList = _mapper.Map<List<ThemeDto>>(themeList);
            return Ok(themeDtoList);
        }

        [AllowAnonymous]
        [HttpGet("{themeId}")]
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
