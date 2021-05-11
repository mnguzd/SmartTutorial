using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using SmartTutorial.API.Dtos.PaginationDtos.SubjectDtos;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;

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
            var subject = new Subject {Complexity = dto.Complexity, Name = dto.Name, ThemeId = dto.ThemeId};
            try
            {
                await _repository.Add(subject);
                await _repository.SaveAll();
            }
            catch
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Theme with id "+dto.ThemeId+" is not found!");
            }
            return subject;
        }

        public async Task<PagedList<Subject>> GetPaginated(SubjectParameters parameters)
        {
            var result = await _repository.GetAll();
            return PagedList<Subject>.ToPagedList(result.ToList(),parameters.PageNumber, parameters.PageSize);
        }

        public async Task Delete(int id)
        {
            var result = await _repository.GetById(id);
            await _repository.Delete(result);
            await _repository.SaveAll();
        }

        public async Task<IList<Subject>> GetAll()
        {
            return await _repository.GetAll();
        }

        public async Task<Subject> GetById(int id)
        {
            var subject = await _repository.GetById(id);
            return subject;
        }

        public Task<Subject> GetWithTopics(int id)
        {
            var result = _repository.GetByIdWithInclude(id, x => x.Topics);
            return result;
        }

        public async Task<Subject> Update(int id, UpdateSubjectDto dto)
        {
            var subject = await _repository.GetById(id);
            if (subject == null)
            {
                return null;
            }

            subject.Name = dto.Name;
            subject.Complexity = dto.Complexity;
            await _repository.SaveAll();
            return subject;
        }

        public async Task<Subject> UpdateWithDetails(int id, PatchSubjectDto dto)
        {
            var subject = await _repository.GetById(id);
            if (subject == null)
            {
                return null;
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
            return subject;
        }
    }
}