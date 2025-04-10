import controller from './controller';
import pluginConfigs from './plugin-configs';
import webhook from './webhook';
import cincopaAsset from './asset';

export default {
  controller,
  'cincopa-settings': pluginConfigs,
  'cincopa-asset': cincopaAsset,
  webhook
};
