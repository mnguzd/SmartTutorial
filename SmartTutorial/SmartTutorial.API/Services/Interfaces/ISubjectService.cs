using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ISubjectService
    {
        public Task<Subject> GetById(int id);
        public Task<IList<Subject>> GetAll();
        public Task<Subject> Add(AddSubjectDto dto);
        public Task<Subject> Update(int id, UpdateSubjectDto dto);
        public Task<Subject> UpdateWithDetails(int id, PatchSubjectDto dto);
        public Task Delete(int id);
    }
}
