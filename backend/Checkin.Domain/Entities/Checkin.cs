namespace Checkin.Domain.Entities;

public class Checkin
{
    public Guid Id { get; set; }

    public string CheckinCode { get; set; } = "";

    public DateTime CreatedAt { get; set; }

    public string Nome { get; set; } = "";

    public string Email { get; set; } = "";

    public string Departamento { get; set; } = "";

    public string PublicIp { get; set; } = "";

    public int? MonitorCount { get; set; }

    public Guid DeviceId { get; set; }

    public Device Device { get; set; } = null!;
}