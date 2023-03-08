# e-Manifest Terminology

## Regulation and Governments

**EPA / US EPA**

- EPA and/or US EPA refers to the United States Environmental Protection Agency, the primary federal environmental
  regulator in the United States of America. [www.epa.gov](https://www.epa.gov/)

**Region**

- EPA maintains ten regional offices to more closely manage regional
  issues. [EPA Regional Website](https://www.epa.gov/aboutepa/regional-and-geographic-offices)

**State**

- State commonly refers to the primary environmental agency of a given US state, such as the New York Department of
  Conservation, the Indiana Department of Environmental Management, or the California Department of Toxic Substances
  Control.

**RCRA / Subtitle C**

- The Resource Conservation and Recovery Act (RCRA) is the primary United States federal law that governs solid and
  hazardous waste. Subtitle C of RCRA addresses hazardous waste and is the framework for the nation’s “cradle-to-grave”
  management program from its generation to treatment, storage, or disposal. [EPA: About RCRA](https://www.epa.gov/rcra)

**Hazardous Waste**

- Hazardous waste is waste with properties that make it dangerous or capable of having a harmful effect on human health
  or the environment. [EPA: About Hazardous Waste](https://www.epa.gov/hw/learn-basics-hazardous-waste)

## Parties to the Manifest

**Handler**

- A handler represents the hazardous waste operations of an entity (such as a person, company, or government) at a fixed
  location.

**Site**

- A site is a fixed location at which hazardous waste activity is conducted. It may also be called a facility.

**Site ID**

- Handlers are assigned a twelve-character alphanumeric Site ID by the State or EPA. They start with a two-letter prefix
  representing the State or Region that assigned them. They are unique to the site. Some states may issue site IDs
  unique to each
  handler. [EPA: About Site IDs](https://www.epa.gov/hwgenerators/how-hazardous-waste-generators-transporters-and-treatment-storage-and-disposal)

**Generator**

- A generator is the handler that produced the hazardous waste. There is only one generator per
  manifest. [EPA: About Generators](https://www.epa.gov/hwgenerators)

**Transporter**

- A transporter is a handler that moves the hazardous waste to the TSDF. There may be multiple transporters on a
  manifest. [EPA: About Transporters](https://www.epa.gov/hw/hazardous-waste-transportation)

**Broker**

- A broker is a handler that prepares a manifest and the shipment on behalf of other handler customers.

**Treatment, Storage, or Disposal Facility (TSDF) / Receiving Facility / Designated Facility**

- A TSDF, also known as a Receiving Facility or the Designated Facility, is the handler to whom the hazardous waste is
  shipped. They are responsible for treating, storing, or disposing of the waste according to state and federal
  law. The terms designated receiving facility, TSD, TSDF are interchangeable [EPA: About Permitted TSDFs](https://www.epa.gov/hwpermitting)

**Alternate Facility**

- In certain cases, the TSDF listed on the manifest cannot accept the shipment of waste. The shipment may be sent to an
  Alternate TSDF according to state and federal law.

## Technology

**RCRAInfo**

- RCRAInfo is the web application used by EPA, states, and industry to report and track RCRA-regulated hazardous waste
  activity. [RCRAInfo.epa.gov](https://rcrainfo.epa.gov)

**e-Manifest**

- e-Manifest is the national program used to facilitate the transmission and record keeping of the uniform manifest
  form, which accompanies shipments of hazardous waste. The technical elements of e-Manifest are housed within
  RCRAInfo. [EPA: e-Manifest](https://epa.gov/e-manifest)

**Services**

- Services refer to the e-Manifest Application Programming Interfaces (APIs) developed and maintained by the
  EPA. [Services Documentation](https://github.com/USEPA/e-manifest)

## The Manifest

**The Uniform Manifest Form**

- The manifest is a standard EPA form that accompanies a shipment of hazardous waste, detailing the location and
  identity of the generator, transporter(s), and TSDF, the type of waste(s), what will happen to the waste at its
  destination, and when custody was exchanged along the route. The manifest was previously exclusively a multipart
  paper document, but it can now be completed electronically. At the conclusion of a shipment, the manifest information
  must be provided to EPA via RCRAInfo’s e-Manifest module.

**Waste Line**

- A waste line is a listing on the manifest of the type of waste, its volume or weight, the type of container it
  occupies, and its waste codes. Each manifest will have at least one waste line.

**Waste Code**

- Each waste line is labeled with waste codes, which are four-character alphanumeric values noting the type of waste or
  its hazardous characteristics. Waste codes can be issued by state or federal
  regulation. [EPA: Defining Hazardous Waste] https://www.epa.gov/hw/defining-hazardous-waste-listed-characteristic-and-mixed-radiological-wastes)

**Management Method**

- The management method is a four-character alphanumeric value noting the process by which the TSDF will treat, store,
  or dispose of the waste on the manifest. Each waste line will have a management method code.

**Rejection**

- Rejection is the process of a TSDF refusing to accept a shipment of waste and that waste being sent to either an
  alternate facility or back to the generator. It may be in whole or in part.

## Where to go to learn more:

- [RCRAInfo Documentation](https://rcrainfo.epa.gov/rcrainfo-help/application/industryHelp/index.htm#t=Introduction.htm)
- [RCRAInfo Data Element Dictionary](https://rcrainfo.epa.gov/rcrainfo-help/application/publicHelp/index.htm#t=introduction.htm)
- [e-Manifest Frequently Asked Questions](https://www.epa.gov/e-manifest/frequent-questions-about-e-manifest)
