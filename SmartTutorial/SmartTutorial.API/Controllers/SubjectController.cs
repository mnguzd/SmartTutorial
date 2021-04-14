using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Services.Interfaces;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectService _subjectService;

        public SubjectController(ISubjectService subjectService)
        {
            _subjectService = subjectService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var subjectsDtoList = await _subjectService.GetAll();
            return Ok(subjectsDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            SubjectDto dto = await _subjectService.GetById(id);
            if (dto == null)
            {
                return NotFound();
            }
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddSubjectDto dto)
        {
            AddSubjectDto subjectDto = await _subjectService.Add(dto);
            return CreatedAtAction(nameof(Post), subjectDto);
        }

        [HttpPut("{id}")]
        [ApiExceptionFilter]
        public async Task<IActionResult> Put(int id,[FromBody] AddSubjectDto dto)
        {
            await _subjectService.Update(id,dto);
            return NoContent();
        }
        [HttpPatch("{id}")]
        [ApiExceptionFilter]
        public async Task<IActionResult> Patch(int id, [FromBody] UpdateSubjectDto dto)
        {
            await _subjectService.UpdateWithDetails(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _subjectService.Delete(id);
            return NoContent();
        }
    }
}
