using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.PaginationDtos.SubjectDtos;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ISubjectService _subjectService;

        public SubjectsController(ISubjectService subjectService, IMapper mapper)
        {
            _subjectService = subjectService;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var subjectList = await _subjectService.GetAll();
            var subjectDtoList = _mapper.Map<List<SubjectDto>>(subjectList);
            return Ok(subjectDtoList);
        }

        [HttpGet("getPaginated")]
        public async Task<IActionResult> Get([FromQuery] SubjectParameters parameters)
        {
            var subjectList = await _subjectService.GetPaginated(parameters);
            var subjectDtoList = _mapper.Map<List<SubjectDto>>(subjectList);
            Response.Headers.Add("X-Pagination", subjectList.TotalCount.ToString());
            return Ok(subjectDtoList);
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id, bool includeTopics = false)
        {
            Subject subject;
            if (!includeTopics)
            {
                subject = await _subjectService.GetById(id);
                if (subject == null)
                {
                    return NotFound();
                }

                var subjectDto = _mapper.Map<SubjectDto>(subject);
                return Ok(subjectDto);
            }

            subject = await _subjectService.GetWithTopics(id);
            if (subject == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<SubjectWithTopicsDto>(subject);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddSubjectDto dto)
        {
            var subject = await _subjectService.Add(dto);
            var subjectDto = _mapper.Map<SubjectDto>(subject);
            return CreatedAtAction(nameof(Post), subjectDto);
        }

        [HttpPut("{id:int}")]
        [ApiExceptionFilter]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateSubjectDto dto)
        {
            var subject = await _subjectService.Update(id, dto);
            if (subject == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPatch("{id:int}")]
        [ApiExceptionFilter]
        public async Task<IActionResult> Patch(int id, [FromBody] PatchSubjectDto dto)
        {
            var subject = await _subjectService.UpdateWithDetails(id, dto);
            if (subject == null)
            {
                return NotFound();
            }

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