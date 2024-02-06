# Steam Group Announcements

This small service supports multiple date/time configurations per server and can announce to your selected Steam group at specific times with messages indicating "JUST WIPED" and "JUST WIPED 2 HOURS AGO."

## config.json

```json
{
  "steam": {
        "username": "username",
        "password": "password",
        "sharedSecret": "shared",
        "groupId": "groupId"
    },
    "servers": [
        {
            "name": "US 10X",
            "connect": "10x.rustafied.com:28015",
            "crontabs": ["30 21 * * WED", "0 19 * * SAT"],
            "reminder": true
        }
    ]
}
```
## Disclaimer
Rate limits are not implemented, so use at your own risk. This is a simple service and is not meant to be used for large scale operations.

I am not responsible for any bans or other actions taken by Steam for using this service. Use at your own risk.

## License
[MIT](https://choosealicense.com/licenses/mit/)