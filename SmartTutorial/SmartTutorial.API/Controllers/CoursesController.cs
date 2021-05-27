using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.CourseDtod;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Services.Interfaces;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService subjectService)
        {
            _courseService = subjectService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var courseList = await _courseService.GetAll();
            return Ok(courseList);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("getPaginated")]
        public async Task<IActionResult> Get(PagedRequest request)
        {
            var courseList = await _courseService.GetPaginated(request);
            return Ok(courseList);
        }

        [AllowAnonymous]
        [HttpGet("{courseId:int}")]
        public async Task<IActionResult> Get(int courseId)
        {
            var course = await _courseService.GetWithSubjects(courseId);
            return Ok(course);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] AddCourseDto dto)
        {
            await _courseService.Update(id, dto);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddCourseDto dto)
        {
            var course = await _courseService.Add(dto);
            return Created(nameof(Post), course);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _courseService.Delete(id);
            return NoContent();
        }
    }
}