# はてなミュート ( Google Chrome 拡張 / Firefox アドオン)

はてなブックマークの記事をキーワードやURLでミュート

[Chrome Web Store](https://chrome.google.com/webstore/detail/agomiblbpgcimbonnfmlcealkjlegbnf)

[Firefox Addon](https://addons.mozilla.org/ja/firefox/addon/%E3%81%AF%E3%81%A6%E3%81%AA%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88/)

<a href="https://chrome.google.com/webstore/detail/agomiblbpgcimbonnfmlcealkjlegbnf" target="_blank"><img src="https://lh3.googleusercontent.com/yGrvuFzlzWu_ZGq8IMQio8LhcbLZw8u8PwzbITpshVklTtqR_Gqfsr9dQXAsZZq27diOmQegWl-GPx7JXQs31OvhFw=w640-h400-e365-rj-sc0x00ffffff" /></a>

## How to Build

Replace `YOUR_TOKEN` with your Github access token that includes `read:packages` permission

```bash
cat << EOF > .npmrc
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
@cside:registry=https://npm.pkg.github.com/
EOF

pnpm install
pnpm run build
```

## Release Notes

[/releases](https://github.com/Cside/hatena-mute/releases)

## How to Contribute

⚠️機能の要望がある場合は pull request を送る前にまずは `/issues` で私に相談してください。

Create a branch from `develop` and make a pull request to `develop` .

## License

[The MIT License](/LICENSE).
