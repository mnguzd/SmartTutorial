using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly ISubjectService _subjectService;
        private readonly IMapper _mapper;

        public SubjectsController(ISubjectService subjectService, IMapper mapper)
        {
            _subjectService = subjectService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var subjectList = await _subjectService.GetAll();
            var subjectDtoList = _mapper.Map<List<SubjectDto>>(subjectList);
            return Ok(subjectDtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            Subject subject = await _subjectService.GetById(id);
            if (subject == null)
            {
                return NotFound();
            }
            SubjectDto subjectDto = _mapper.Map<SubjectDto>(subject);
            return Ok(subjectDto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddSubjectDto dto)
        {
            Subject subject = await _subjectService.Add(dto);
            SubjectDto subjectDto = _mapper.Map<SubjectDto>(subject);
            return CreatedAtAction(nameof(Post), subjectDto);
        }

        [HttpPut("{id}")]
        [ApiExceptionFilter]
        public async Task<IActionResult> Put(int id,[FromBody] UpdateSubjectDto dto)
        {
            Subject subject = await _subjectService.Update(id,dto);
            if (subject == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPatch("{id}")]
        [ApiExceptionFilter]
        public async Task<IActionResult> Patch(int id, [FromBody] PatchSubjectDto dto)
        {
            Subject subject = await _subjectService.UpdateWithDetails(id, dto);
            if (subject == null)
            {
                return NotFound();
            }
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
