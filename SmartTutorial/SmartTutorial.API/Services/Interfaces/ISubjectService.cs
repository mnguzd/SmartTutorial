using SmartTutorial.API.Dtos.SubjectDtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ISubjectService
    {
        public Task<SubjectDto> GetById(int id);
        public Task<IList<SubjectDto>> GetAll();
        public Task<AddSubjectDto> Add(AddSubjectDto dto);
        public Task Update(int id, AddSubjectDto dto);
        public Task UpdateWithDetails(int id, UpdateSubjectDto dto);
        public Task Delete(int id);
    }
}
