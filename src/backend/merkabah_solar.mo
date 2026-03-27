import Float "mo:core/Float";

module {
  public type Vector3D = {
    x : Float;
    y : Float;
    z : Float;
  };

  public type MerkabahSolar = {
    tetraedroMasculino : Vector3D;
    tetraedroFeminino : Vector3D;
    chiHermetica : Float;
    ar4366Flux : Float;
    autisticContinuum : Bool;
  };

  public func crossProduct(a : Vector3D, b : Vector3D) : Vector3D {
    {
      x = a.y * b.z - a.z * b.y;
      y = a.z * b.x - a.x * b.z;
      z = a.x * b.y - a.y * b.x;
    };
  };

  public func scaleVector(v : Vector3D, factor : Float) : Vector3D {
    {
      x = v.x * factor;
      y = v.y * factor;
      z = v.z * factor;
    };
  };

  public func computeToroidalField(cross : Vector3D, chiHermetica : Float) : Vector3D {
    scaleVector(cross, chiHermetica);
  };

  public func calculateFieldIntensity(toroidalField : Vector3D, autisticContinuum : Bool) : Float {
    let baseIntensity = Float.sqrt(
      toroidalField.x * toroidalField.x +
      toroidalField.y * toroidalField.y +
      toroidalField.z * toroidalField.z
    );
    if (autisticContinuum) {
      baseIntensity * 10.0; // Amplify by 10 if autistic continuum is true
    } else {
      baseIntensity;
    };
  };

  public func init() : MerkabahSolar {
    {
      tetraedroMasculino = {
        x = 1.0;
        y = 0.0;
        z = 0.0;
      };
      tetraedroFeminino = {
        x = 0.0;
        y = 1.0;
        z = 0.0;
      };
      chiHermetica = 2.000012;
      ar4366Flux = 1.0;
      autisticContinuum = false;
    };
  };

  public func getParams(self : MerkabahSolar) : MerkabahSolar {
    self;
  };

  public func ativar(self : MerkabahSolar, intention : Float) : Float {
    let cross = crossProduct(self.tetraedroMasculino, self.tetraedroFeminino);
    let scaledCross = scaleVector(cross, self.ar4366Flux * intention * 1.618);
    let toroidalField = computeToroidalField(scaledCross, self.chiHermetica);
    let toroidalIntensity = calculateFieldIntensity(toroidalField, self.autisticContinuum);
    toroidalIntensity;
  };
};
