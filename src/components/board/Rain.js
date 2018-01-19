import {poissrand} from "../../utils/poisson";

class Rain {
  constructor(size, effect, dps) {
    this.size = size;
    this.effect = effect;
    this.dps = dps
  }

  apply(timestep) {
    if (timestep > 0) {
      const lambda = timestep * this.dps / 1000;
      const drops = poissrand(lambda);
      for (let i = 0; i < drops; i++)
        this.effect(this.size.random().floor());
    }
  }
}


export default Rain;
