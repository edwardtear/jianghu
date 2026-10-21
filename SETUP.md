# 江湖一生 · 上线步骤 (Setup guide)

整个过程大约 20–30 分钟，全部免费。完成第 1 步后告诉我，我来把游戏推上去；第 3 步完成后把配置发给我，我来接上登录和反馈。

## 1. 在 GitHub 建一个仓库
1. 打开 https://github.com/new
2. Repository name 填 `jianghu`，选 **Public**，勾上 *Add a README file*，点 **Create repository**。
3. 让 Claude 能写入这个仓库：打开 https://github.com/apps/claude/installations/select_target ，选你的账号 → *Only select repositories* → 加上 `jianghu` → Save。
4. 回来告诉我"仓库建好了"。

（不想装 Claude 应用的话也可以手动上传：在仓库页面点 *Add file → Upload files*，把压缩包 `jianghu-site.zip` 解压后里面的全部文件拖进去，点 *Commit changes*。）

## 2. 打开 GitHub Pages（让网址能访问）
1. 仓库页面 → **Settings** → 左边 **Pages**。
2. *Source* 选 **Deploy from a branch**，Branch 选 **main**，文件夹选 **/(root)**，点 Save。
3. 一两分钟后，游戏就在 **https://edwardtear.github.io/jianghu/** 上线了，谁都能玩（进度先存在各自的浏览器里）。

## 3. 建 Firebase 项目（登录账号 + 云存档 + 反馈）
1. 打开 https://console.firebase.google.com ，用你的 Google 账号登录，点 **Create a project**，名字填 `jianghu`，Google Analytics 可以关掉。
2. 项目首页点 **</>（Web）** 图标添加网页应用，名字随便填（如 jianghu-web），不用勾 Hosting，点 Register。屏幕上会出现一段 `const firebaseConfig = { apiKey: ..., ... }` —— **把这一整段复制发给我**。（这段配置本来就是公开放在网页里的，不是密码。）
3. 左边 **Build → Authentication → Get started**：
   - *Sign-in method* 里打开 **Google**（选你的邮箱作为支持邮箱）和 **Email/Password**。
   - *Settings → Authorized domains* 里点 *Add domain*，加上 `edwardtear.github.io`。
4. 左边 **Build → Firestore Database → Create database**：位置选 `asia-southeast1 (Singapore)`（离你近），模式选 **production**。
5. 建好后点 **Rules** 标签，把仓库里 `firestore.rules` 文件的内容整个贴进去，点 **Publish**。

## 4. 看玩家反馈
Firebase 控制台 → **Firestore Database** → `feedback` 集合，每一条就是一封留言（类别、内容、对方留的联系方式、当时那一世的概况）。

想让反馈直接发到你的邮箱？可以在 Firebase 里装官方扩展 *Trigger Email*（需要把项目升级到按量付费的 Blaze 方案，个人用量通常是 0 元）。需要的话告诉我，我来教你配。

---

# English summary
1. Create a public GitHub repo named `jianghu` (with a README) and give the Claude GitHub App access to it — or upload the files from `jianghu-site.zip` by hand.
2. Settings → Pages → Deploy from branch `main`, folder `/ (root)`. The game goes live at https://edwardtear.github.io/jianghu/.
3. Create a Firebase project, add a Web app and send me its `firebaseConfig`; enable Google and Email/Password sign-in; add `edwardtear.github.io` as an authorised domain; create Firestore (production mode) and publish the rules from `firestore.rules`.
4. Feedback appears in Firestore under `feedback`.
