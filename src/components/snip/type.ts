export interface SnipProps {
  img: string;
  drawColor?: string;
  SnipDatas: SnipData[];
  onChange: (snipDatas: SnipData) => void;
}

export interface SnipData {
  startP: { x: number; y: number };
  endP: { x: number; y: number };
  class: string;
  snipImage: string;
  // 表原图
  source: string;
}
