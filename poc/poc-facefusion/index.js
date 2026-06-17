// PoC 云函数：人脸保持验证（卡点① Kill Point 01）
// 目标：验证「证件照能不能保住本人的脸」。
//
// ⚠️ 选型结论（写代码前必须知道）：
//   - 混元生图 (hunyuan, TextToImage) = 文生图，做不出「是本人」，不要用它测证件照。
//   - 证件照保真的正确 API 是腾讯云【人脸融合 FaceFusion】：把用户的脸融进证件照/职业装模板，
//     单图、快、保真度高，是 MVP 首选。本 harness 就调它。
//   - 高保真多风格走【AI 写真 aiart 训练】（多图训练 LoRA，贵且慢），二期再说。
//
// 部署：放进微信云开发 cloudfunctions/，由有环境凭证的同学 deploy 到 env=cloud1-2gwjs0icafd5f64a。
// FaceFusion 需要先在腾讯云「人脸融合」控制台创建【活动 + 素材模板】并审核通过，拿到 ProjectId / ModelId。
//
// 依赖：tencentcloud-sdk-nodejs (FaceFusion 在独立产品 facefusion，非 hunyuan)
//   云开发内置成长计划混元 Token 不覆盖 facefusion —— 需确认 facefusion 是否开通/有额度。

const tencentcloud = require('tencentcloud-sdk-nodejs');
const FacefusionClient = tencentcloud.facefusion.v20220927.Client;

// 凭证来源（二选一，部署时确认）：
//   A. 云开发内置：若环境已注入 TENCENT_SECRETID/KEY 则直接用；
//   B. 自带密钥：从云函数环境变量读取（不要硬编码进仓库）。
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: 'ap-guangzhou',
  profile: { httpProfile: { endpoint: 'facefusion.tencentcloudapi.com' } },
};

/**
 * event:
 *   faceImageBase64  — 用户自拍（base64，去掉 data: 前缀）
 *   projectId        — 人脸融合活动 ID（控制台创建）
 *   modelId          — 素材模板 ID（证件照/职业装底版）
 */
exports.main = async (event) => {
  const { faceImageBase64, projectId, modelId } = event;
  if (!faceImageBase64 || !projectId || !modelId) {
    return { ok: false, error: 'missing faceImageBase64 / projectId / modelId' };
  }

  const client = new FacefusionClient(clientConfig);
  try {
    // FuseFace：把 MergeInfo 里的脸融进 modelId 对应的模板
    const resp = await client.FuseFace({
      ProjectId: projectId,
      ModelId: modelId,
      RspImgType: 'base64',
      MergeInfos: [{ Image: faceImageBase64 }],
      FuseProfileDegree: 80, // 保留本人特征的程度，0-100，越高越像本人
      FuseFaceDegree: 80,
    });
    return {
      ok: true,
      resultImageBase64: resp.FusedImage, // 生成图，回传群里人工评估保真度
      requestId: resp.RequestId,
      // 评估维度：① 是不是本人 ② 五官/轮廓有无走形 ③ 模板套装是否自然
    };
  } catch (e) {
    return {
      ok: false,
      error: e.message,
      // 若报「产品未开通/无权限」→ 证实了：成长计划混元 Token 不覆盖 facefusion，需单独开通。
      code: e.code,
    };
  }
};
