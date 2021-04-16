using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
