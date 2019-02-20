# _Home Sweet Host_ - Host Set-Up

## SSH

- [Hardening SSH, _Jason Rigden_](https://medium.com/@jasonrigden/hardening-ssh-1bcb99cd4cef):

  - Key-Authentication:
    - If necessary, generate a SSH keypair with `ssh-keygen`
    - copy it to the host: `ssh-copy-id pirate@black-pearl`
  - `sshd_config`:
    - Changes:
      ```config
      Protocol 2
      Port 2294
      AllowUsers pirate
      PermitRootLogin no
      ClientAliveInterval 300
      ClientAliveCountMax 2
      PasswordAuthentication no
      PermitEmptyPasswords no
      X11Forwarding no
      KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512,diffie-hel$
      MACs umac-128-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com
      Ciphers chacha20-poly1305@openssh.com,aes128-ctr,aes192-ctr,aes256-ctr,aes128-gcm@openssh.com,aes256-gcm@openssh.$
      HostKey /etc/ssh/ssh_host_rsa_key
      HostKey /etc/ssh/ssh_host_ed25519_key
      ```
    - Test: `sshd -t`
    - Reload: `sudo systemctl reload sshd`
  - Check Config with SSH Audit (`python ssh-audit.py -p 2294 black-pearl`)
  - Not covered:
    - Fail2Ban
    - Multi-factor-authentication
    - Banners
    - Regenerate Moduli

- [Secure the SSH server on Ubuntu, Hitesh Jethva](https://devops.profitbricks.com/tutorials/secure-the-ssh-server-on-ubuntu/)
  - `sshd_config`:
    - Changes:
      ```config
      PrintLastLog no
      IgnoreRhosts yes
      RhostsAuthentication no
      RSAAuthentication yes
      HostbasedAuthentication no
      LoginGraceTime 60
      MaxStartups 2
      AllowTcpForwarding no
      X11Forwarding no
      PermitEmptyPasswords no
      ```

## External USB Drives

At first, new USB drives must be formatted.

```
# Find USB drive
df -h   # yields e.g. /dev/sdb1

# Unmount USB drive
umount /dev/sdb1

# Format in ext4 format
sudo mkfs.ext4 -F /dev/sdb1
```


Then, mount USB drives to a static directory:

### 1. Find device:

```bash
sudo fdisk -l
```

### 2. Make mount directory:

```bash
sudo mkdir /media/usb-drive
```

### 3. Mount USB device to directory:

```bash
sudo mount /dev/sda1 /media/usb-drive
```

### 4. Check mount:

```bash
mount | grep sda1
```

Drives can also be mounted statically by adding the line
```bash
/dev/sda1       /media/usb-drive           vfat    defaults        0       0 
```
to the file `/etc/fstab`. However, such drive names - in this example `sda1` - are not a unique identifier for an individual USB drive. To mount it by its UUID, run

```bash
ls -l /dev/disk/by-uuid/*
```

which shows e.g.

```
...
dev/disk/by-uuid/C896-14A6 -> ../../sdb1
```

i.e. add the following line to `/etc/fstab`:

```
/dev/disk/by-uuid/C896-14A6    /media/usb-drive         vfat   0   0
```