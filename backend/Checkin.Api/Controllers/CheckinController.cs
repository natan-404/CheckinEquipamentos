using Checkin.Api.DTOs;
using Checkin.Domain.Entities;
using Checkin.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace Checkin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckinController : ControllerBase
{
    private readonly AppDbContext _context;

    public CheckinController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Test()
    {
        return Ok(new
        {
            Message = "API funcionando",
            Devices = _context.Devices.Count(),
            Checkins = _context.Checkins.Count()
        });
    }

    [HttpPost]
public IActionResult Create(CreateCheckinRequest request)
{
    Console.WriteLine("===== DADOS RECEBIDOS =====");
Console.WriteLine($"Nome: {request.Nome}");
Console.WriteLine($"Email: {request.Email}");
Console.WriteLine($"Departamento: {request.Departamento}");
Console.WriteLine($"UUID: {request.DeviceIdentifier}");

    Console.WriteLine("===== CHECKIN =====");
    Console.WriteLine($"Nome: {request.Nome}");
    Console.WriteLine($"UUID: [{request.DeviceIdentifier}]");

    if (string.IsNullOrWhiteSpace(request.DeviceIdentifier))
    {
        return BadRequest("UUID do equipamento não informado.");
    }

    var device = _context.Devices
        .FirstOrDefault(x => x.DeviceIdentifier == request.DeviceIdentifier);

    if (device == null)
    {
        var proximoPatrimonio =
            $"PAT-{(_context.Devices.Count() + 1):D4}";

        device = new Device
{
    Id = Guid.NewGuid(),
    DeviceCode = Guid.NewGuid().ToString(),
    AssetTag = proximoPatrimonio,

    ComputerName = request.ComputerName,
    Manufacturer = request.Manufacturer,
    Model = request.Model,
    SerialNumber = request.SerialNumber,

    Cpu = request.Cpu,
    RamGb = request.RamGb,
    Gpu = request.Gpu,

    DiskModel = request.DiskModel,
    DiskSizeGb = request.DiskSizeGb,

    OperatingSystem = request.OperatingSystem,
    DeviceIdentifier = request.DeviceIdentifier,

    UsuarioNome = request.Nome,
    UsuarioEmail = request.Email,
    UsuarioDepartamento = request.Departamento
};

        _context.Devices.Add(device);
        _context.SaveChanges();
    }

    device.UsuarioNome = request.Nome;
device.UsuarioEmail = request.Email;
device.UsuarioDepartamento = request.Departamento;

    var checkin = _context.Checkins
        .FirstOrDefault(x => x.DeviceId == device.Id);

    if (checkin == null)
    {
        checkin = new Checkin.Domain.Entities.Checkin
        {
            Id = Guid.NewGuid(),
            CheckinCode = Guid.NewGuid().ToString(),
            DeviceId = device.Id
        };

        _context.Checkins.Add(checkin);
    }

    checkin.Nome = request.Nome;
    checkin.Email = request.Email;
    checkin.Departamento = request.Departamento;
    checkin.PublicIp = request.PublicIp;
    checkin.CreatedAt = DateTime.UtcNow;

    _context.SaveChanges();

    return Ok(new
    {
        Success = true,
        DeviceId = device.Id,
        CheckinId = checkin.Id
    });
    }

    [HttpPost("usuario")]
public IActionResult SalvarUsuario([FromBody] UsuarioDto request)
{
    Console.WriteLine("===== USUARIO RECEBIDO =====");
    Console.WriteLine(request.Nome);
    Console.WriteLine(request.Email);
    Console.WriteLine(request.Departamento);

    return Ok();
}

    [HttpGet("devices")]
    public IActionResult Devices()
    {
        var devices = _context.Devices
            .Select(x => new
            {
                x.AssetTag,

                x.ComputerName,
                x.Manufacturer,
                x.Model,
                x.SerialNumber,
                x.Cpu,
                x.RamGb,
                x.Gpu,
                x.DiskModel,
                x.DiskSizeGb,
                x.OperatingSystem,
                x.DeviceIdentifier
            })
            .ToList();

        return Ok(devices);
    }

    [HttpGet("report")]
    public IActionResult Report()
    {
        var report = _context.Checkins
            .OrderByDescending(x => x.CreatedAt)
            .ToList()
            .GroupBy(x => x.DeviceId)
            .Select(g => g.First())
            .Join(
                _context.Devices,
                checkin => checkin.DeviceId,
                device => device.Id,
                (checkin, device) => new
                {
                    patrimonio = device.AssetTag,

                    nome = device.UsuarioNome,
                    email = device.UsuarioEmail,
                    departamento = device.UsuarioDepartamento,

                    createdAt = checkin.CreatedAt,

                    computador = device.ComputerName,
                    fabricante = device.Manufacturer,
                    modelo = device.Model,
                    serial = device.SerialNumber,

                    cpu = device.Cpu,
                    ramGb = device.RamGb,
                    gpu = device.Gpu,

                    sistema = device.OperatingSystem,

                    disco = device.DiskModel,
                    discoGb = device.DiskSizeGb,

                    uuid = device.DeviceIdentifier
                }
            )
            .OrderBy(x => x.nome)
            .ToList();

        return Ok(report);
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> Clear()
    {
        _context.Checkins.RemoveRange(_context.Checkins);

        await _context.SaveChangesAsync();

        return Ok("Histórico apagado.");
    }

    [HttpDelete("reset")]
public IActionResult Reset()
{
    _context.Checkins.RemoveRange(_context.Checkins);
    _context.Devices.RemoveRange(_context.Devices);

    _context.SaveChanges();

    return Ok("Banco limpo.");
}

[HttpGet("device/{uuid}")]
public IActionResult GetDeviceUser(string uuid)
{
    var device = _context.Devices
        .FirstOrDefault(x => x.DeviceIdentifier == uuid);

    if (device == null)
    {
        return NotFound();
    }

    return Ok(new
{
    nome = device.UsuarioNome,
    email = device.UsuarioEmail,
    departamento = device.UsuarioDepartamento
});

}


}