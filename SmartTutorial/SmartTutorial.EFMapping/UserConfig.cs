using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartTutorial.Domain.Auth;

namespace SmartTutorial.EFMapping
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(e => e.Country)
                .HasMaxLength(30);
            builder.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(30)
                .HasDefaultValue("Webtutor");
            builder.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(30)
                .HasDefaultValue("User");
        }
    }
}
