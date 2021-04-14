using AutoMapper;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Implementations
{
    public class SubjectService : ISubjectService
    {
        private readonly IGenericRepository<Subject> _repository;
        private readonly IMapper _mapper;

        public SubjectService(IGenericRepository<Subject> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<AddSubjectDto> Add(AddSubjectDto dto)
        {
            Subject subject = _mapper.Map<Subject>(dto);
            await _repository.Add(subject);
            await _repository.SaveAll();
            return dto;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete(id);
            await _repository.SaveAll();
        }

        public async Task<IList<SubjectDto>> GetAll()
        {
            var subjectList = await _repository.GetAll();
            var subjectDtoList = _mapper.Map<List<SubjectDto>>(subjectList);
            return subjectDtoList;
        }

        public async Task<SubjectDto> GetById(int id)
        {
            Subject subject = await _repository.GetById(id);
            SubjectDto dto = _mapper.Map<SubjectDto>(subject);
            return dto;
        }

        public async Task Update(int id, AddSubjectDto dto)
        {
            Subject subject = await _repository.GetById(id);
            if (subject == null)
            {
                throw new NotFoundException("Subject not found!");
            }
            _mapper.Map(dto, subject);
            await _repository.SaveAll();
        }
        public async Task UpdateWithDetails(int id, UpdateSubjectDto dto)
        {

        }

    }
}
