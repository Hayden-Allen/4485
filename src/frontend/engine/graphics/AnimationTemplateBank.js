import lunr from 'lunr'
import { global } from '%engine/Global.js'

class AnimationTemplateInfo {
  constructor(name, frameTime, urls) {
    this.name = name
    this.frameTime = frameTime
    this.urls = urls
  }
}

export const animationTemplateBank = [
  new AnimationTemplateInfo('Blank', 0, ['/MissingTexture.svg']),
  ...global.alphabetSort([
    new AnimationTemplateInfo('c_green', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0000.png',
      '/sprites/kenney/pixel-platformer/characters/character_0001.png',
    ]),
    new AnimationTemplateInfo('c_green_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0000_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0001_r.png',
    ]),
    new AnimationTemplateInfo('c_blue', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0002.png',
      '/sprites/kenney/pixel-platformer/characters/character_0003.png',
    ]),
    new AnimationTemplateInfo('c_blue_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0002_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0003_r.png',
    ]),
    new AnimationTemplateInfo('c_red', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0004.png',
      '/sprites/kenney/pixel-platformer/characters/character_0005.png',
    ]),
    new AnimationTemplateInfo('c_red_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0004_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0005_r.png',
    ]),
    new AnimationTemplateInfo('c_yellow', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0006.png',
      '/sprites/kenney/pixel-platformer/characters/character_0007.png',
    ]),
    new AnimationTemplateInfo('c_yellow_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0006_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0007_r.png',
    ]),
    new AnimationTemplateInfo('c_peach_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0009_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0010_r.png',
    ]),
    new AnimationTemplateInfo('c_peach', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0009.png',
      '/sprites/kenney/pixel-platformer/characters/character_0010.png',
    ]),
    new AnimationTemplateInfo('c_peach_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0009_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0010_r.png',
    ]),
    new AnimationTemplateInfo('e_spike', 0, [
      '/sprites/kenney/pixel-platformer/characters/character_0008.png',
    ]),
    new AnimationTemplateInfo('e_fish', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0011.png',
      '/sprites/kenney/pixel-platformer/characters/character_0012.png',
    ]),
    new AnimationTemplateInfo('e_block', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0013.png',
      '/sprites/kenney/pixel-platformer/characters/character_0014.png',
    ]),
    new AnimationTemplateInfo('e_spike2', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0015.png',
      '/sprites/kenney/pixel-platformer/characters/character_0016.png',
    ]),
    new AnimationTemplateInfo('e_spike2_frozen', 0, [
      '/sprites/kenney/pixel-platformer/characters/character_0017.png',
    ]),
    new AnimationTemplateInfo('e_brick_s', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0018.png',
      '/sprites/kenney/pixel-platformer/characters/character_0019.png',
    ]),
    new AnimationTemplateInfo('e_brick_s_frozen', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0020.png',
    ]),
    new AnimationTemplateInfo('e_brick_s_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0018_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0019_r.png',
    ]),
    new AnimationTemplateInfo('e_brick_s_r_frozen', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0020_r.png',
    ]),
    new AnimationTemplateInfo('e_brick_l', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0021.png',
      '/sprites/kenney/pixel-platformer/characters/character_0022.png',
    ]),
    new AnimationTemplateInfo('e_brick_l_frozen', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0023.png',
    ]),
    new AnimationTemplateInfo('e_brick_l_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0021_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0022_r.png',
    ]),
    new AnimationTemplateInfo('e_brick_l_r_frozen', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0023_r.png',
    ]),
    new AnimationTemplateInfo('e_fly', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0024.png',
      '/sprites/kenney/pixel-platformer/characters/character_0025.png',
      '/sprites/kenney/pixel-platformer/characters/character_0026.png',
    ]),
    new AnimationTemplateInfo('e_fly_r', 150, [
      '/sprites/kenney/pixel-platformer/characters/character_0024_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0025_r.png',
      '/sprites/kenney/pixel-platformer/characters/character_0026_r.png',
    ]),
    new AnimationTemplateInfo('t_0000', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0000.png',
    ]),
    new AnimationTemplateInfo('t_0001', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0001.png',
    ]),
    new AnimationTemplateInfo('t_0002', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0002.png',
    ]),
    new AnimationTemplateInfo('t_0003', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0003.png',
    ]),
    new AnimationTemplateInfo('t_0004', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0004.png',
    ]),
    new AnimationTemplateInfo('t_0005', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0005.png',
    ]),
    new AnimationTemplateInfo('t_0006', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0006.png',
    ]),
    new AnimationTemplateInfo('t_0007', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0007.png',
    ]),
    new AnimationTemplateInfo('t_0008', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0008.png',
    ]),
    new AnimationTemplateInfo('t_0009', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0009.png',
    ]),
    new AnimationTemplateInfo('t_0010', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0010.png',
    ]),
    new AnimationTemplateInfo('t_0011', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0011.png',
    ]),
    new AnimationTemplateInfo('t_0012', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0012.png',
    ]),
    new AnimationTemplateInfo('t_0013', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0013.png',
    ]),
    new AnimationTemplateInfo('t_0014', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0014.png',
    ]),
    new AnimationTemplateInfo('t_0015', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0015.png',
    ]),
    new AnimationTemplateInfo('t_0016', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0016.png',
    ]),
    new AnimationTemplateInfo('t_0017', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0017.png',
    ]),
    new AnimationTemplateInfo('t_0018', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0018.png',
    ]),
    new AnimationTemplateInfo('t_0019', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0019.png',
    ]),
    new AnimationTemplateInfo('t_0020', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0020.png',
    ]),
    new AnimationTemplateInfo('t_0021', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0021.png',
    ]),
    new AnimationTemplateInfo('t_0022', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0022.png',
    ]),
    new AnimationTemplateInfo('t_0023', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0023.png',
    ]),
    new AnimationTemplateInfo('t_0024', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0024.png',
    ]),
    new AnimationTemplateInfo('t_0025', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0025.png',
    ]),
    new AnimationTemplateInfo('t_0026', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0026.png',
    ]),
    new AnimationTemplateInfo('t_0027', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0027.png',
    ]),
    new AnimationTemplateInfo('t_0028', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0028.png',
    ]),
    new AnimationTemplateInfo('t_0029', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0029.png',
    ]),
    new AnimationTemplateInfo('t_0030', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0030.png',
    ]),
    new AnimationTemplateInfo('t_0031', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0031.png',
    ]),
    new AnimationTemplateInfo('t_0032', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0032.png',
    ]),
    new AnimationTemplateInfo('t_0033', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0033.png',
    ]),
    new AnimationTemplateInfo('t_0034', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0034.png',
    ]),
    new AnimationTemplateInfo('t_0035', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0035.png',
    ]),
    new AnimationTemplateInfo('t_0036', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0036.png',
    ]),
    new AnimationTemplateInfo('t_0037', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0037.png',
    ]),
    new AnimationTemplateInfo('t_0038', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0038.png',
    ]),
    new AnimationTemplateInfo('t_0039', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0039.png',
    ]),
    new AnimationTemplateInfo('t_0040', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0040.png',
    ]),
    new AnimationTemplateInfo('t_0041', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0041.png',
    ]),
    new AnimationTemplateInfo('t_0042', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0042.png',
    ]),
    new AnimationTemplateInfo('t_0043', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0043.png',
    ]),
    new AnimationTemplateInfo('t_0044', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0044.png',
    ]),
    new AnimationTemplateInfo('t_0045', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0045.png',
    ]),
    new AnimationTemplateInfo('t_0046', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0046.png',
    ]),
    new AnimationTemplateInfo('t_0047', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0047.png',
    ]),
    new AnimationTemplateInfo('t_0048', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0048.png',
    ]),
    new AnimationTemplateInfo('t_0049', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0049.png',
    ]),
    new AnimationTemplateInfo('t_0050', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0050.png',
    ]),
    new AnimationTemplateInfo('t_0051', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0051.png',
    ]),
    new AnimationTemplateInfo('t_0052', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0052.png',
    ]),
    new AnimationTemplateInfo('t_0053', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0053.png',
    ]),
    new AnimationTemplateInfo('t_0054', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0054.png',
    ]),
    new AnimationTemplateInfo('t_0055', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0055.png',
    ]),
    new AnimationTemplateInfo('t_0056', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0056.png',
    ]),
    new AnimationTemplateInfo('t_0057', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0057.png',
    ]),
    new AnimationTemplateInfo('t_0058', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0058.png',
    ]),
    new AnimationTemplateInfo('t_0059', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0059.png',
    ]),
    new AnimationTemplateInfo('t_0060', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0060.png',
    ]),
    new AnimationTemplateInfo('t_0061', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0061.png',
    ]),
    new AnimationTemplateInfo('t_0062', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0062.png',
    ]),
    new AnimationTemplateInfo('t_0063', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0063.png',
    ]),
    new AnimationTemplateInfo('t_0064', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0064.png',
    ]),
    new AnimationTemplateInfo('t_0065', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0065.png',
    ]),
    new AnimationTemplateInfo('t_0066', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0066.png',
    ]),
    new AnimationTemplateInfo('t_0067', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0067.png',
    ]),
    new AnimationTemplateInfo('t_0068', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0068.png',
    ]),
    new AnimationTemplateInfo('t_0069', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0069.png',
    ]),
    new AnimationTemplateInfo('t_0070', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0070.png',
    ]),
    new AnimationTemplateInfo('t_0071', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0071.png',
    ]),
    new AnimationTemplateInfo('t_0072', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0072.png',
    ]),
    new AnimationTemplateInfo('t_0073', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0073.png',
    ]),
    new AnimationTemplateInfo('t_0074', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0074.png',
    ]),
    new AnimationTemplateInfo('t_0075', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0075.png',
    ]),
    new AnimationTemplateInfo('t_0076', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0076.png',
    ]),
    new AnimationTemplateInfo('t_0077', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0077.png',
    ]),
    new AnimationTemplateInfo('t_0078', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0078.png',
    ]),
    new AnimationTemplateInfo('t_0079', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0079.png',
    ]),
    new AnimationTemplateInfo('t_0080', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0080.png',
    ]),
    new AnimationTemplateInfo('t_0081', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0081.png',
    ]),
    new AnimationTemplateInfo('t_0082', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0082.png',
    ]),
    new AnimationTemplateInfo('t_0083', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0083.png',
    ]),
    new AnimationTemplateInfo('t_0084', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0084.png',
    ]),
    new AnimationTemplateInfo('t_0085', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0085.png',
    ]),
    new AnimationTemplateInfo('t_0086', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0086.png',
    ]),
    new AnimationTemplateInfo('t_0087', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0087.png',
    ]),
    new AnimationTemplateInfo('t_0088', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0088.png',
    ]),
    new AnimationTemplateInfo('t_0089', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0089.png',
    ]),
    new AnimationTemplateInfo('t_0090', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0090.png',
    ]),
    new AnimationTemplateInfo('t_0091', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0091.png',
    ]),
    new AnimationTemplateInfo('t_0092', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0092.png',
    ]),
    new AnimationTemplateInfo('t_0093', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0093.png',
    ]),
    new AnimationTemplateInfo('t_0094', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0094.png',
    ]),
    new AnimationTemplateInfo('t_0095', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0095.png',
    ]),
    new AnimationTemplateInfo('t_0096', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0096.png',
    ]),
    new AnimationTemplateInfo('t_0097', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0097.png',
    ]),
    new AnimationTemplateInfo('t_0098', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0098.png',
    ]),
    new AnimationTemplateInfo('t_0099', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0099.png',
    ]),
    new AnimationTemplateInfo('t_0100', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0100.png',
    ]),
    new AnimationTemplateInfo('t_0101', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0101.png',
    ]),
    new AnimationTemplateInfo('t_0102', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0102.png',
    ]),
    new AnimationTemplateInfo('t_0103', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0103.png',
    ]),
    new AnimationTemplateInfo('t_0104', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0104.png',
    ]),
    new AnimationTemplateInfo('t_0105', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0105.png',
    ]),
    new AnimationTemplateInfo('t_0106', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0106.png',
    ]),
    new AnimationTemplateInfo('t_0107', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0107.png',
    ]),
    new AnimationTemplateInfo('t_0108', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0108.png',
    ]),
    new AnimationTemplateInfo('t_0109', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0109.png',
    ]),
    new AnimationTemplateInfo('t_0110', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0110.png',
    ]),
    new AnimationTemplateInfo('t_0111', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0111.png',
    ]),
    new AnimationTemplateInfo('t_0112', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0112.png',
    ]),
    new AnimationTemplateInfo('t_0113', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0113.png',
    ]),
    new AnimationTemplateInfo('t_0114', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0114.png',
    ]),
    new AnimationTemplateInfo('t_0115', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0115.png',
    ]),
    new AnimationTemplateInfo('t_0116', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0116.png',
    ]),
    new AnimationTemplateInfo('t_0117', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0117.png',
    ]),
    new AnimationTemplateInfo('t_0118', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0118.png',
    ]),
    new AnimationTemplateInfo('t_0119', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0119.png',
    ]),
    new AnimationTemplateInfo('t_0120', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0120.png',
    ]),
    new AnimationTemplateInfo('t_0121', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0121.png',
    ]),
    new AnimationTemplateInfo('t_0122', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0122.png',
    ]),
    new AnimationTemplateInfo('t_0123', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0123.png',
    ]),
    new AnimationTemplateInfo('t_0124', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0124.png',
    ]),
    new AnimationTemplateInfo('t_0125', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0125.png',
    ]),
    new AnimationTemplateInfo('t_0126', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0126.png',
    ]),
    new AnimationTemplateInfo('t_0127', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0127.png',
    ]),
    new AnimationTemplateInfo('t_0128', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0128.png',
    ]),
    new AnimationTemplateInfo('t_0129', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0129.png',
    ]),
    new AnimationTemplateInfo('t_0130', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0130.png',
    ]),
    new AnimationTemplateInfo('t_0131', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0131.png',
    ]),
    new AnimationTemplateInfo('t_0132', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0132.png',
    ]),
    new AnimationTemplateInfo('t_0133', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0133.png',
    ]),
    new AnimationTemplateInfo('t_0134', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0134.png',
    ]),
    new AnimationTemplateInfo('t_0135', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0135.png',
    ]),
    new AnimationTemplateInfo('t_0136', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0136.png',
    ]),
    new AnimationTemplateInfo('t_0137', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0137.png',
    ]),
    new AnimationTemplateInfo('t_0138', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0138.png',
    ]),
    new AnimationTemplateInfo('t_0139', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0139.png',
    ]),
    new AnimationTemplateInfo('t_0140', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0140.png',
    ]),
    new AnimationTemplateInfo('t_0141', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0141.png',
    ]),
    new AnimationTemplateInfo('t_0142', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0142.png',
    ]),
    new AnimationTemplateInfo('t_0143', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0143.png',
    ]),
    new AnimationTemplateInfo('t_0144', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0144.png',
    ]),
    new AnimationTemplateInfo('t_0145', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0145.png',
    ]),
    new AnimationTemplateInfo('t_0146', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0146.png',
    ]),
    new AnimationTemplateInfo('t_0147', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0147.png',
    ]),
    new AnimationTemplateInfo('t_0148', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0148.png',
    ]),
    new AnimationTemplateInfo('t_0149', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0149.png',
    ]),
    new AnimationTemplateInfo('t_0150', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0150.png',
    ]),
    new AnimationTemplateInfo('t_0151', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0151.png',
    ]),
    new AnimationTemplateInfo('t_0152', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0152.png',
    ]),
    new AnimationTemplateInfo('t_0153', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0153.png',
    ]),
    new AnimationTemplateInfo('t_0154', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0154.png',
    ]),
    new AnimationTemplateInfo('t_0155', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0155.png',
    ]),
    new AnimationTemplateInfo('t_0156', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0156.png',
    ]),
    new AnimationTemplateInfo('t_0157', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0157.png',
    ]),
    new AnimationTemplateInfo('t_0158', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0158.png',
    ]),
    new AnimationTemplateInfo('t_0159', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0159.png',
    ]),
    new AnimationTemplateInfo('t_0160', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0160.png',
    ]),
    new AnimationTemplateInfo('t_0161', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0161.png',
    ]),
    new AnimationTemplateInfo('t_0162', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0162.png',
    ]),
    new AnimationTemplateInfo('t_0163', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0163.png',
    ]),
    new AnimationTemplateInfo('t_0164', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0164.png',
    ]),
    new AnimationTemplateInfo('t_0165', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0165.png',
    ]),
    new AnimationTemplateInfo('t_0166', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0166.png',
    ]),
    new AnimationTemplateInfo('t_0167', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0167.png',
    ]),
    new AnimationTemplateInfo('t_0168', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0168.png',
    ]),
    new AnimationTemplateInfo('t_0169', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0169.png',
    ]),
    new AnimationTemplateInfo('t_0170', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0170.png',
    ]),
    new AnimationTemplateInfo('t_0171', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0171.png',
    ]),
    new AnimationTemplateInfo('t_0172', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0172.png',
    ]),
    new AnimationTemplateInfo('t_0173', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0173.png',
    ]),
    new AnimationTemplateInfo('t_0174', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0174.png',
    ]),
    new AnimationTemplateInfo('t_0175', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0175.png',
    ]),
    new AnimationTemplateInfo('t_0176', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0176.png',
    ]),
    new AnimationTemplateInfo('t_0177', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0177.png',
    ]),
    new AnimationTemplateInfo('t_0178', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0178.png',
    ]),
    new AnimationTemplateInfo('t_0179', 0, [
      '/sprites/kenney/pixel-platformer/tiles/tile_0179.png',
    ]),
  ]),
]

export const animationTemplateIndex = lunr(function () {
  this.field('name')
  this.ref('id')

  animationTemplateBank.forEach((info, i) => {
    this.add({
      id: i,
      name: info.name,
    })
  })
})
