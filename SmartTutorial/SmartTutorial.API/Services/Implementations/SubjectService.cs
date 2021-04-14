using SmartTutorial.API.Dtos.SubjectDtos;
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

        public SubjectService(IGenericRepository<Subject> repository)
        {
            _repository = repository;
        }

        public async Task<Subject> Add(AddSubjectDto dto)
        {
            Subject subject = new Subject() { Complexity = dto.Complexity, Name = dto.Name };
            await _repository.Add(subject);
            await _repository.SaveAll();
            return subject;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete(id);
            await _repository.SaveAll();
        }

        public async Task<IList<Subject>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Subject> GetById(int id)
        {
            Subject subject = await _repository.GetById(id);
            return subject;
        }

        public async Task<Subject> Update(int id, UpdateSubjectDto dto)
        {
            Subject subject = await _repository.GetById(id);
            if (subject == null)
            {
                return null;
            }
            subject.Name = dto.Name;
            subject.Complexity = dto.Complexity;
            await _repository.SaveAll();
            return subject;
        }
        public async Task<Subject> UpdateWithDetails(int id, UpdateSubjectDto dto)
        {
            Subject subject = await _repository.GetById(id);
            if (subject == null)
            {
                return null;
            }
            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                subject.Name = dto.Name;
            }
            subject.Complexity = dto.Complexity;
            await _repository.SaveAll();
            return subject;
        }

    }
}
