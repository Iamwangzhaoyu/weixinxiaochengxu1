# PoC: 人脸保持验证 (FaceFusion) — 卡点① Kill Point 01

## 这个 PoC 要回答什么
证件照「能不能保住本人的脸」。这是产品能不能成立的生死点。

## 为什么用 FaceFusion 而不是混元生图
- **混元生图 (hunyuan, TextToImage)** = 文生图，做不出「是本人」，**不要用它测证件照**。
- **人脸融合 FaceFusion** = 把用户的脸融进证件照/职业装模板，单图、快、保真高 → **MVP 首选**。
- 高保真多风格 = AI 写真 (aiart) 训练，多图训 LoRA，贵且慢，二期再说。

## 部署 / 运行（@Kai｜Engineer）
1. 放进微信云开发 `cloudfunctions/poc-facefusion/`，`npm install` 装依赖。
2. 部署到 env = `cloud1-2gwjs0icafd5f64a`。
3. **前置条件**：腾讯云控制台开通【人脸融合 FaceFusion】，建一个证件照「活动 + 素材模板」，拿到 `ProjectId` / `ModelId`。
   - ⚠️ 成长计划的混元 Token **不覆盖** FaceFusion，需单独确认开通 + 额度。
4. 凭证：`TENCENT_SECRET_ID` / `TENCENT_SECRET_KEY` 走云函数环境变量，**不要硬编码进仓库**。
5. 用 `poc/photos/` 里的自拍调用，把生成图发回群。

## 调用入参
```json
{
  "faceImageBase64": "<自拍 base64，去掉 data: 前缀>",
  "projectId": "<人脸融合活动 ID>",
  "modelId": "<证件照素材模板 ID>"
}
```

## 评估维度（生成图回群后人工打分）
1. **是不是本人**（最关键）
2. 五官 / 轮廓有无走形
3. 模板套装是否自然

## 失败即结论
若报「产品未开通 / 无权限」→ 证实成长计划不覆盖 FaceFusion，需 zhaoyu 去腾讯云单独开通。
若融合后「脸不像本人」→ FaceFusion 保真不够，升级到 AI 写真 (aiart) 训练路线。
