using SmartTutorial.Domain;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace SmartTutorial.API.Repositories.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        Task<TEntity> GetById(int id);

        Task<TEntity> GetByIdWithInclude(int id, params Expression<Func<TEntity, object>>[] includeProperties);

        Task<List<TEntity>> GetAll();

        Task<bool> SaveAll();

        Task<TEntity> Add(TEntity entity);

        TEntity Update(TEntity entity);

        Task<TEntity> Delete(int id);
    }
}
