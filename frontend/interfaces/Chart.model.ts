export interface IDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderWidth: number;
}
interface IChart {
  labels: string[];
  datasets: IDataset[];
}
export default IChart;
