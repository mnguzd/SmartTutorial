using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;

namespace SmartTutorial.API.Services.Implementations
{
    public class SubjectService : ISubjectService
    {
        private readonly IMapper _mapper;
        private readonly IRepository _repository;

        public SubjectService(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<SubjectDto> Add(AddSubjectDto dto)
        {
            var subject = new Subject {Complexity = dto.Complexity, Name = dto.Name, CourseId = dto.ThemeId};
            //add with Save
            await _repository.Add(subject);
            await _repository.SaveAll();
            var subjectDto = _mapper.Map<SubjectDto>(subject);
            return subjectDto;
        }

        public async Task<PaginatedResult<SubjectDto>> GetPaginated(PagedRequest request)
        {
            var result = await _repository.GetPagedData<Subject, SubjectDto>(request);
            return result;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete<Subject>(id);
            await _repository.SaveAll();
        }

        public async Task<IList<SubjectDto>> GetAll()
        {
            var subjects = await _repository.GetAll<Subject>();
            var subjectsDto = _mapper.Map<List<SubjectDto>>(subjects);
            return subjectsDto;
        }

        public async Task<SubjectDto> GetById(int id)
        {
            var subject = await _repository.GetById<Subject>(id);
            var subjectDto = _mapper.Map<SubjectDto>(subject);
            return subjectDto;
        }

        public async Task<SubjectWithTopicsDto> GetWithTopics(int id)
        {
            var subject = await _repository.GetByIdWithInclude<Subject>(id, x => x.Topics);
            var subjectDto = _mapper.Map<SubjectWithTopicsDto>(subject);
            return subjectDto;
        }

        public async Task<SubjectDto> Update(int id, UpdateSubjectDto dto)
        {
            var subject = await _repository.GetById<Subject>(id);
            if (subject == null)
            {
                throw new ApiException(HttpStatusCode.Conflict, "User not found");
            }

            subject.Name = dto.Name;
            subject.Complexity = dto.Complexity;
            await _repository.SaveAll();
            var subjectDto = _mapper.Map<SubjectDto>(subject);
            return subjectDto;
        }

        public async Task<SubjectDto> UpdateWithDetails(int id, PatchSubjectDto dto)
        {
            var subject = await _repository.GetById<Subject>(id);
            if (subject == null)
            {
                throw new ApiException(HttpStatusCode.Conflict, "User not found");
            }

            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                subject.Name = dto.Name;
            }

            if (dto.Complexity != null)
            {
                subject.Complexity = (int) dto.Complexity;
            }

            await _repository.SaveAll();
            var subjectDto = _mapper.Map<SubjectDto>(subject);
            return subjectDto;
        }
    }
}