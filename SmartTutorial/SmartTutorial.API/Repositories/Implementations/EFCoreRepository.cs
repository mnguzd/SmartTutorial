using Microsoft.EntityFrameworkCore;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace SmartTutorial.API.Repositories.Implementations
{
    public class EFCoreRepository<TEntity> : IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        private readonly SmartTutorialDbContext _context;
        private readonly DbSet<TEntity> _dbSet;

        public EFCoreRepository(SmartTutorialDbContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }
       
        public async Task<TEntity> Add(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
            return entity;
        }

        public async Task<TEntity> Delete(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if(entity == null)
            {
                return null;
            }
            _dbSet.Remove(entity);
            return entity;
        }

        public async Task<List<TEntity>> GetAll()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<TEntity> GetById(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<TEntity> GetByIdWithInclude(int id, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            var query = IncludeProperties(includeProperties);
            return await query.FirstOrDefaultAsync(entity => entity.Id == id);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync()>=0;
        }

        public TEntity Update(TEntity entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            return entity;
        }
        private IQueryable<TEntity> IncludeProperties(params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> entities = _dbSet;
            foreach (var includeProperty in includeProperties)
            {
                entities = entities.Include(includeProperty);
            }
            return entities;
        }
    }
}
