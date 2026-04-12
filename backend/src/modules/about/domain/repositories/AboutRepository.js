export class AboutRepository {
  async getMain() {
    throw new Error("AboutRepository#getMain must be implemented");
  }

  async createMain(_aboutData) {
    throw new Error("AboutRepository#createMain must be implemented");
  }

  async updateMain(_aboutData) {
    throw new Error("AboutRepository#updateMain must be implemented");
  }
}

export default AboutRepository;
