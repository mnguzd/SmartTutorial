using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartTutorial.API.Migrations
{
    public partial class AddedImagesToTheme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Theme_ThemeId",
                table: "Subjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Theme",
                table: "Themes");

            migrationBuilder.RenameTable(
                name: "Themes",
                newName: "Themes");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Themes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Themes",
                table: "Themes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Themes_ThemeId",
                table: "Subjects",
                column: "ThemeId",
                principalTable: "Themes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Subjects_Themes_ThemeId",
                table: "Subjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Themes",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Themes");

            migrationBuilder.RenameTable(
                name: "Themes",
                newName: "Themes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Theme",
                table: "Themes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subjects_Theme_ThemeId",
                table: "Subjects",
                column: "ThemeId",
                principalTable: "Theme",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
