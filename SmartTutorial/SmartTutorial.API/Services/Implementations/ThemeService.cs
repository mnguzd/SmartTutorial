using System.Collections.Generic;
using System.Threading.Tasks;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;

namespace SmartTutorial.API.Services.Implementations
{
    public class ThemeService : IThemeService
    {
        private readonly IGenericRepository<Theme> _repository;

        public ThemeService(IGenericRepository<Theme> repository)
        {
            _repository = repository;
        }

        public async Task<IList<Theme>> GetAll()
        {
            return await _repository.GetAll();
        }

        public Task<Theme> GetWithInclude(int id)
        {
            var result = _repository.GetByIdWithInclude(id, x => x.Subjects);
            return result;
        }
    }
}