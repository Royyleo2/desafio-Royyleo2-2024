class Animal {
    constructor(species, size, biomes) {
      this.species = species;
      this.size = size;
      this.biomes = biomes;
    }
  }
  
  class Recinto {
    constructor(number, biome, totalSize, animals = []) {
      this.number = number;
      this.biome = biome;
      this.totalSize = totalSize;
      this.animals = animals;
      this.freeSpace = this.calculateFreeSpace();
    }
  
    calculateFreeSpace() {
      const spaceUsed = this.animals.reduce((total, animal) => total + animal.size * animal.quantity, 0);
      const extraSpace = this.animals.length > 1 ? 1 : 0;
      return this.totalSize - spaceUsed - extraSpace;
    }
  
    addAnimals(newAnimals) {
      this.animals.push(...newAnimals);
      this.freeSpace = this.calculateFreeSpace();
    }
  }
  
  class Zoo {
    constructor(recintos, animais) {
      this.recintos = recintos;
      this.animais = animais;
    }
  
    isCompatible(animal, recinto, quantity) {
      const isCarnivoro = ["LEAO", "LEOPARDO", "CROCODILO"].includes(animal.species);
      if (isCarnivoro && recinto.animals.some(a => a.species !== animal.species)) {
        return false; // Carnívoros não podem compartilhar recinto com outras espécies
      }
  
      if (!isCarnivoro && recinto.animals.some(a => ["LEAO", "LEOPARDO", "CROCODILO"].includes(a.species))) {
        return false; // Outros animais não podem ser colocados com carnívoros
      }
  
      const existingAnimals = recinto.animals.find(a => a.species === animal.species);
      if (existingAnimals && (existingAnimals.quantity + quantity) * animal.size > recinto.totalSize) {
        return false; // Sem espaço suficiente para o animal
      }
  
      if (animal.species === "HIPOPOTAMO" && recinto.biome !== "savana e rio") {
        return false; // Hipopótamo só pode coabitar se for em savana e rio
      }
  
      if (animal.species === "MACACO") {
        const totalMacacos = (existingAnimals ? existingAnimals.quantity : 0) + quantity;
        if (totalMacacos === 1 && recinto.animals.length === 0) {
          return false; // Macaco não pode ficar sozinho
        }
      }
  
      return true;
    }
  
    findSuitableRecintos(species, quantity) {
      if (!this.animais[species]) {
        return { erro: "Animal inválido" };
      }
  
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return { erro: "Quantidade inválida" };
      }
  
      const { size: animalSize, biomes: animalBiomes } = this.animais[species];
      const suitableRecintos = [];
  
      for (const recinto of this.recintos) {
        if (
          animalBiomes.includes(recinto.biome) &&
          recinto.freeSpace >= animalSize * quantity &&
          this.isCompatible(new Animal(species, animalSize, animalBiomes), recinto, quantity)
        ) {
          suitableRecintos.push(
            `Recinto ${recinto.number} (espaço livre: ${recinto.freeSpace - animalSize * quantity} total: ${recinto.totalSize})`
          );
        }
      }
  
      if (suitableRecintos.length === 0) {
        return { erro: "Não há recinto viável" };
      }
  
      return { suitableRecintos };
    }
  }
  
  // Exemplo de uso
  const recintos = [
    new Recinto(1, 'savana', 10, [{ species: 'MACACO', size: 1, quantity: 3 }]),
    new Recinto(2, 'floresta', 5),
    new Recinto(3, 'savana e rio', 7, [{ species: 'GAZELA', size: 2, quantity: 1 }]),
    new Recinto(4, 'rio', 8),
    new Recinto(5, 'savana', 9, [{ species: 'LEAO', size: 3, quantity: 1 }])
  ];
  
  const animais = {
    LEAO: { size: 3, biomes: ['savana'] },
    LEOPARDO: { size: 2, biomes: ['savana'] },
    CROCODILO: { size: 3, biomes: ['rio'] },
    MACACO: { size: 1, biomes: ['savana', 'floresta'] },
    GAZELA: { size: 2, biomes: ['savana'] },
    HIPOPOTAMO: { size: 4, biomes: ['savana', 'rio'] }
  };
  
  const zoo = new Zoo(recintos, animais);
  
  const result = zoo.findSuitableRecintos('LEAO', 2);
  console.log(result);
  