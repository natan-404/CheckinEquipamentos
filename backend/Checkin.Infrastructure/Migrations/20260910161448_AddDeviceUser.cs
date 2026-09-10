using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Checkin.infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UsuarioDepartamento",
                table: "Devices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioEmail",
                table: "Devices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioNome",
                table: "Devices",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioDepartamento",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "UsuarioEmail",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "UsuarioNome",
                table: "Devices");
        }
    }
}
