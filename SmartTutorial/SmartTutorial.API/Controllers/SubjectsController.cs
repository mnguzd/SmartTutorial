using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Services.Interfaces;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExceptionFilter]
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectService _subjectService;

        public SubjectsController(ISubjectService subjectService)
        {
            _subjectService = subjectService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var subjectList = await _subjectService.GetAll();
            return Ok(subjectList);
        }

        [AllowAnonymous]
        [HttpPost("getPaginated")]
        public async Task<IActionResult> Post(PagedRequest request)
        {
            var subjectList = await _subjectService.GetPaginated(request);
            return Ok(subjectList);
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var subject = await _subjectService.GetById(id);
            return Ok(subject);
        }

        [AllowAnonymous]
        [HttpGet("withTopics/{id:int}")]
        public async Task<IActionResult> GetWithTopics(int id)
        {
            var subject = await _subjectService.GetWithTopics(id);
            return Ok(subject);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddSubjectDto dto)
        {
            var subject = await _subjectService.Add(dto);
            return Created(nameof(Post), subject);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateSubjectDto dto)
        {
            await _subjectService.Update(id, dto);
            return NoContent();
        }

        [HttpPatch("{id:int}")]
        public async Task<IActionResult> Patch(int id, [FromBody] PatchSubjectDto dto)
        {
            await _subjectService.UpdateWithDetails(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _subjectService.Delete(id);
            return NoContent();
        }
    }
}