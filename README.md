> **_NOTE:_**  This Angular application is part of the Temperature Logger system, this readme is specifically for the whole system. The Agular part is found at the [bottom](#Anglar-web-app).

# TemperatureLogger
Temperature logger of multiple temperature sensors attached to a central heating system. The sampling of the temperature sensors is done via NodeRed. NodeRed sends every sample as a JSON package to the database wich is a part of TICK-stack.

## Raspbian (buster)
The first step is setting up [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) (Debian for Raspberry Pi). The Raspbian Lite version is sufficient enough. Make sure you install Raspbian Buster.

## Configure WiFi
1. `sudo raspi-config`
1. Configure WiFi settings
1. Configure hostname

## Samba
Installing samba enables the usage of hostname instead of ip-address
1. Update the system `sudo apt-get update`
1. Install samba `sudo apt-get -y install samba`
1. Install smbclient `sudo apt-get -y install smbclient`
1. Now you can SSH to the Raspberry Pi with putty to the hostname

## Node-Red
Set up [node-red](https://nodered.org/docs/getting-started/raspberrypi) for Raspberry Pi for sampling the sensors.
1. `sudo apt-get -y install nodered`
1. Starting node-red
   * `node-red-start` for starting node-red
   * `node-red-stop` for stopping node-red
   * `sudo systemctl enable nodered.service` for starting node-red as a service at boot

## Git
Setting up [Git](https://projects.raspberrypi.org/en/projects/getting-started-with-git/4) for the [node-red project](https://nodered.org/docs/user-guide/projects/) is done as shown below.
  * `sudo apt-get -y install git`
  * Change `editorTheme: projects: enabled:` to `true` in `home/pi/.node-red/settings.js`.
  * Reboot the system

## TICK-stack
Install [TICK-stack](https://iotbyhvm.ooo/tick-satck-on-raspberry-pi/) with the following commands.
* `curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -`
* `echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list`
* `sudo apt-get update`
* `sudo apt-get install telegraf influxdb chronograf kapacitor`

## Database redirection to usb
 * Set automount by adding `UUID=<uid of usb-drive> /media/usb vfat auto,noatime,rw,gid=influxdb,uid=influxdb 0 0` into the file `/etc/fstab`
 * In the file `/etc/telegraf/telegraf.conf` change the [input.disk].mount_points to the location for example `/media/usb`
 * Change the following in the file `/etc/influxdb/influxdb.conf`
```
# under [meta]
dir = "/new/path/to/influxdb/meta"

# under [data]
dir = "/new/path/to/influxdb/data"
wal-dir = "/new/path/to/influxdb/wal"
```

## Adding nodes
The following nodes are required for running the [node-red](https://github.com/BardoelT/temperature-logger-node-red) project for reading the temperature sensors and sending the data to the database.
 * [DS18B20](https://flows.nodered.org/node/node-red-contrib-sensor-ds18b20) node for interfacing with the temperature sensors
 * [influxdb](https://flows.nodered.org/node/node-red-contrib-influxdb) node for interfacing with the database

# Anglar web-app
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.1.

## serving
On the host (Raspberry-Pi) do the following for serving the application.
 * Install angular
 * Install `npm install express`
 * Build the Angular project with `ng build --prod`
 * Copy the `dist` folder to the `logger-web-app` directory
 * Copy [`server.js`](https://github.com/BardoelT/temperature-logger-web-app/blob/master/release/server.js) to the host to the following path `~/logger-web-app`.
 * Copy [`temperature-logger-web-app-service.service`](https://github.com/BardoelT/temperature-logger-web-app/blob/master/release/temperature-logger-web-app-service.service) to the host `etc/systemd/system/`
 * Enable the service with `sudo systemctl enable temperature-logger-web-app-service.service`

# Ports
The following interfaces can be found on the corresponding ports.
| Port | Interface |
|-|-|
| 8888 | Chronograf |
| 3000 | Angular web-app |
| 1880 | node-red |
