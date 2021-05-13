using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTutorial.API.Dtos.PaginationDtos.SubjectDtos;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiExceptionFilter]
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

        [AllowAnonymous]
        [HttpGet("getPaginated")]
        public async Task<IActionResult> Get([FromQuery] SubjectParameters parameters)
        {
            var subjectList = await _subjectService.GetPaginated(parameters);
            var subjectListDto = _mapper.Map<List<SubjectDto>>(subjectList.ToList());
            var pagedList = new PagedSubjectDtoList { Items = subjectListDto, TotalCount = subjectList.TotalCount };
            return Ok(pagedList);
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var subject = await _subjectService.GetById(id);
            var subjectDto = _mapper.Map<SubjectDto>(subject);
            return Ok(subjectDto);
        }

        [AllowAnonymous]
        [HttpGet("withTopics/{id:int}")]
        public async Task<IActionResult> GetWithTopics(int id)
        {
            var subject = await _subjectService.GetWithTopics(id);
            var dto = _mapper.Map<SubjectWithTopicsDto>(subject);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddSubjectDto dto)
        {
            var subject = await _subjectService.Add(dto);
            var subjectDto = _mapper.Map<SubjectDto>(subject);
            return Created(nameof(Post), subjectDto);
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