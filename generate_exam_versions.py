import json
import os

# Base directory for English lessons
base_dir = "backend/app/data/lessons/en"
os.makedirs(base_dir, exist_ok=True)

# ----------------------------------------------------------------------
# 1. METADATA DE VERSIONES - TOEIC (BUSINESS CONTEXTS)
# ----------------------------------------------------------------------
toeic_themes = [
  {
    "company": "Zenith Corp",
    "leader": "the Sales Director",
    "focus": "Meetings & CRM Transition",
    "crm": "ApexCRM",
    "room": "Conference Room B",
    "day": "Monday",
    "time": "10:00 AM",
    "photo_desc": "A) They are discussing the CRM dashboard. B) They are leaving the main lobby. C) The server room is closed. D) They are filing paper documents.",
    "photo_correct": "Statement A",
    "photo_explain": "La descripción correcta es la A, ya que se observa a los representantes analizando el panel del CRM.",
    "dialogue": "M: Hi Sarah, did you get a chance to review the shipment contract from Zenith Corp?\nW: I did. Their pricing is competitive, but their delivery window is too narrow for our schedule.\nM: I see. I will call the Sales Director to negotiate an extension.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Sales Representatives\n*From:* Sales Department\n*Subject: CRM Software Transition*\n\nPlease note that starting next Monday, we are officially retiring our legacy sales tool and migrating to ApexCRM. An interactive onboarding session will be held this Thursday at 10:00 AM in Conference Room B. Attendance is mandatory."
  },
  {
    "company": "ApexCorp",
    "leader": "the Operations Chief",
    "focus": "Logistics & International Shipping",
    "crm": "NexusCRM",
    "room": "Conference Room A",
    "day": "Tuesday",
    "time": "9:00 AM",
    "photo_desc": "A) They are loading packages onto the truck. B) They are signing the shipping invoices. C) The warehouse doors are closed. D) They are reviewing the freight shipping terms.",
    "photo_correct": "Statement D",
    "photo_explain": "La descripción correcta es la D, ya que se ve a los agentes de logística revisando las cláusulas del flete marítimo.",
    "dialogue": "M: Hi Emily, did you get a chance to review the logistics invoice from ApexCorp?\nW: Yes. The freight rates are reasonable, but the port clearance fee is higher than expected.\nM: Let's call the Operations Chief to request a waiver.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Logistics Partners\n*From:* Operations Department\n*Subject: Port Freight Clearance & NexusCRM Integration*\n\nPlease note that starting next Tuesday, all bills of lading must be logged through NexusCRM. Training is scheduled for this Friday at 9:00 AM in Conference Room A."
  },
  {
    "company": "Nexus Industries",
    "leader": "the HR Director",
    "focus": "Human Resources & Talent Acquisition",
    "crm": "NovaCRM",
    "room": "Conference Room C",
    "day": "Wednesday",
    "time": "11:30 AM",
    "photo_desc": "A) They are interviewing a job applicant. B) The HR offices are being painted. C) They are printing employee contracts. D) They are leaving the training hall.",
    "photo_correct": "Statement A",
    "photo_explain": "La descripción B es errónea; la A es correcta porque representa una entrevista formal de selección.",
    "dialogue": "M: Hi Jessica, did you see the new HR guidelines from Nexus Industries?\nW: Yes, they focus on payroll integration and onboarding. The HR Director sent the draft.\nM: I will email the HR team to schedule our onboarding walkthrough.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Hiring Managers\n*From:* HR Department\n*Subject: Onboarding and NovaCRM Setup*\n\nPlease note that starting next Thursday, all candidate evaluation files must be uploaded to NovaCRM. A workshop will be held this Wednesday at 11:30 AM in Conference Room C."
  },
  {
    "company": "Nova Solutions",
    "leader": "the PR Director",
    "focus": "Digital Marketing & PR Campaigns",
    "crm": "QuantumCRM",
    "room": "Conference Suite 4",
    "day": "Thursday",
    "time": "1:00 PM",
    "photo_desc": "A) They are recording a television commercial. B) They are discussing the brand logo on the display screen. C) They are distributing marketing leaflets. D) The design agency is closed.",
    "photo_correct": "Statement B",
    "photo_explain": "Se observa al equipo de diseño analizando la tipografía y el logotipo de la marca en la pantalla.",
    "dialogue": "M: Hi Amanda, did the PR firm Nova Solutions approve the press release?\nW: Yes. The PR Director wants us to coordinate the release of the campaign data through QuantumCRM.\nM: Great, let's schedule a conference to finalize this.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Marketing Associates\n*From:* Public Relations Department\n*Subject: Campaign Rollout & QuantumCRM Sync*\n\nPlease note that starting next Friday, all digital advertising metrics must be synchronized with QuantumCRM. A alignment session will take place this Thursday at 1:00 PM in Conference Suite 4."
  },
  {
    "company": "Quantum Corp",
    "leader": "the CFO",
    "focus": "Corporate Finance & Fiscal Audits",
    "crm": "SyncCRM",
    "room": "Conference Main Hall",
    "day": "Friday",
    "time": "2:30 PM",
    "photo_desc": "A) They are presenting the annual budget spreadsheet. B) They are locking the vault doors. C) The accountants are leaving the building. D) They are filing tax tax returns.",
    "photo_correct": "Statement A",
    "photo_explain": "La descripción A representa al director financiero mostrando el balance contable y proyecciones en la pantalla.",
    "dialogue": "M: Hi Ashley, did you check the audit reports from Quantum Corp?\nW: I did. The CFO wants us to log all tax filings and audit logs in SyncCRM.\nM: Got it. I will contact the financial division directly.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Finance Department\n*From:* Chief Financial Officer\n*Subject: Q3 Audit Preparation & SyncCRM Logging*\n\nPlease note that starting next Saturday, all internal expense reports must be finalized and logged via SyncCRM. A prep meeting is scheduled for this Friday at 2:30 PM in the Conference Main Hall."
  },
  {
    "company": "Vortex Ltd",
    "leader": "the Operations Director",
    "focus": "Quality Control & Factory Operations",
    "crm": "VortexCRM",
    "room": "Conference Boardroom",
    "day": "Saturday",
    "time": "3:00 PM",
    "photo_desc": "A) They are wearing safety helmets on the factory floor. B) They are purchasing safety equipment online. C) The assembly line is fully automated. D) They are repairing the conveyor belt.",
    "photo_correct": "Statement A",
    "photo_explain": "Los operarios llevan equipo de protección reglamentario (cascos y chalecos) en la planta industrial.",
    "dialogue": "M: Hi Michael, did you receive the safety audit from Vortex Ltd?\nW: Yes, the Operations Director sent it. The plant compliance is high, but we need to log the metrics in VortexCRM.\nM: I will schedule a follow-up with the safety inspector.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Plant Supervisors\n*From:* Operations Department\n*Subject: Quality Inspections & VortexCRM Registration*\n\nPlease note that starting next Sunday, all equipment inspection logs must be recorded in VortexCRM. A review session will be held this Saturday at 3:00 PM in the Conference Boardroom."
  },
  {
    "company": "Starlight Inc",
    "leader": "the IT Director",
    "focus": "IT Infrastructure & Server Support",
    "crm": "CloudCRM",
    "room": "Conference Annex Room",
    "day": "Sunday",
    "time": "4:30 PM",
    "photo_desc": "A) They are installing routers in the server rack. B) They are replacing the computer monitors. C) The data center is empty. D) They are coding a mobile application.",
    "photo_correct": "Statement A",
    "photo_explain": "Se observa a los ingenieros de sistemas conectando el cableado estructurado en el rack de servidores.",
    "dialogue": "M: Hi David, did you check the network upgrade plan from Starlight Inc?\nW: Yes. The IT Director wants all cloud access permissions registered in CloudCRM by tonight.\nM: Good. That will secure our databases before the system migration.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Systems Engineers\n*From:* IT Department\n*Subject: Network Migration & CloudCRM Permissions*\n\nPlease note that starting next Monday, we are migrating to our new fiber database. A security setup session will be held this Sunday at 4:30 PM in the Conference Annex Room."
  },
  {
    "company": "Horizon Enterprise",
    "leader": "the Client Services VP",
    "focus": "Customer Service & Service Level Agreements",
    "crm": "EliteCRM",
    "room": "Conference Room 302",
    "day": "next Friday",
    "time": "8:00 AM",
    "photo_desc": "A) They are answering calls at the service center. B) They are sorting client refund claims. C) The customer care division is closed. D) They are training new support executives.",
    "photo_correct": "Statement A",
    "photo_explain": "Se observa a los agentes de atención al cliente con diademas atendiendo llamadas de soporte en vivo.",
    "dialogue": "M: Hi James, did Horizon Enterprise send the new SLA terms?\nW: Yes. The Client Services VP wants all client satisfaction rates logged under EliteCRM.\nM: Perfect, let's make sure our support team is fully aligned.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Support Supervisors\n*From:* Client Services\n*Subject: SLA Protocol & EliteCRM Training*\n\nPlease note that starting next Friday, all customer incident tickets must be logged in EliteCRM. A review session will take place this next Friday at 8:00 AM in Conference Room 302."
  },
  {
    "company": "Titan Logistics",
    "leader": "the Procurement Director",
    "focus": "Supply Chain & Procurement Contracts",
    "crm": "FlexCRM",
    "room": "Conference Room 101",
    "day": "next Friday",
    "time": "12:00 PM",
    "photo_desc": "A) They are signing the supplier agreement. B) They are inspecting raw materials. C) The shipping container is being loaded. D) They are negotiating the purchase orders.",
    "photo_correct": "Statement D",
    "photo_explain": "Los ejecutivos están sentados discutiendo las cláusulas y montos de las órdenes de compra de materias primas.",
    "dialogue": "M: Hi John, did the procurement team at Titan Logistics approve the contract?\nW: Yes. The Procurement Director wants us to submit the finalized purchase orders in FlexCRM.\nM: I will handle the system upload right away.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Purchasing Agents\n*From:* Procurement Department\n*Subject: Vendor Contracts & FlexCRM Registry*\n\nPlease note that starting this weekend, all supplier agreements must be recorded in FlexCRM. An interactive review session will be held this next Friday at 12:00 PM in Conference Room 101."
  },
  {
    "company": "Summit Media",
    "leader": "the CEO",
    "focus": "Strategic Planning & Restructuring",
    "crm": "ActiveCRM",
    "room": "Conference West Wing",
    "day": "next Monday",
    "time": "5:00 PM",
    "photo_desc": "A) They are drawing the organizational chart. B) They are leaving the executive boardroom. C) The strategy office is empty. D) They are reviewing the corporate acquisition plan.",
    "photo_correct": "Statement D",
    "photo_explain": "Se observa a la mesa directiva analizando el organigrama y el dossier de adquisición estratégica.",
    "dialogue": "M: Hi Robert, did you review the expansion plan from Summit Media?\nW: Yes, the CEO sent it. All departmental goals must be mapped under ActiveCRM.\nM: I will synchronize the task boards today.",
    "memo_text": "**MEMORANDUM**\n\n*To:* Division Heads\n*From:* Chief Executive Officer\n*Subject: Corporate Strategy & ActiveCRM Targets*\n\nPlease note that starting next Monday, all quarterly key performance indicators must be logged in ActiveCRM. An alignment meeting will be held this weekend at 5:00 PM in the Conference West Wing."
  }
]

# ----------------------------------------------------------------------
# 2. METADATA DE VERSIONES - TOEFL & IELTS (ACADEMIC TOPICS)
# ----------------------------------------------------------------------
academic_themes = [
  {
    "topic": "Ciencias y Cosmos",
    "title": "Astronomía: La Habitabilidad de Kepler-186f",
    "reading_text": "**The Habitability of Kepler-186f**\n\nIn recent stellar astrobiology, astronomers have focused on Kepler-186f, the first validated Earth-size planet orbiting within the habitable zone of an M-dwarf star. M-dwarfs, or red dwarfs, constitute nearly seventy percent of all stars in the Milky Way, making planetary systems around them highly common. While red dwarfs undergo intense stellar flares that release high-energy ultraviolet radiation, recent atmosphere models show that Kepler-186f's dense atmospheric carbon dioxide could serve as a protective barrier. This atmospheric retention suggests that liquid water could stably exist on the planetary surface under convective atmospheric conditions, presenting a major vector for extrasolar biosignature research.",
    "reading_q1": "According to the passage, what is the significance of Kepler-186f?",
    "reading_q1_opts": [
      "It is the largest planet discovered in the Milky Way.",
      "It is the first Earth-size planet found in a red dwarf's habitable zone.",
      "It emits stellar flares that help sustain volcanic outgassing.",
      "It lacks any protective atmospheric carbon dioxide."
    ],
    "reading_q1_correct": "It is the first Earth-size planet found in a red dwarf's habitable zone.",
    "reading_q1_explain": "El texto menciona directamente que Kepler-186f es 'the first validated Earth-size planet orbiting within the habitable zone of an M-dwarf star'.",
    
    "reading_q2": "What is the closest meaning of the word **retention** in context?",
    "reading_q2_opts": ["Exclusion", "Loss", "Maintenance / Preservation", "Fluctuation"],
    "reading_q2_correct": "Maintenance / Preservation",
    "reading_q2_explain": "En el contexto de la retención atmosférica ('atmospheric retention'), se refiere a la preservación o mantenimiento de la atmósfera protectora.",

    "lecture_title": "Lecture on Stellar Evolution & Solar Wind Impact",
    "lecture_audio": "Professor: Today we discuss stellar winds in red dwarf systems. These winds are streams of charged particles ejected from the star's corona. M-dwarfs exhibit persistent coronal mass ejections that are far more intense than those of our Sun. These charged particles strike orbiting planets and can cause atmospheric stripping. However, if a planet possesses a strong intrinsic magnetic field, this field acts as a shield, deflecting the solar wind and preventing the loss of volatile water compounds.",
    "lecture_q1": "What is the main topic of the professor's lecture?",
    "lecture_q1_opts": [
      "The composition of our Sun's coronal mass ejections.",
      "How stellar winds interact with planetary atmospheres and magnetic fields.",
      "The migration of gas giants in red dwarf systems.",
      "The role of volcanic eruptions in creating water fields."
    ],
    "lecture_q1_correct": "How stellar winds interact with planetary atmospheres and magnetic fields.",
    "lecture_q1_explain": "El profesor detalla los vientos estelares ('stellar winds'), la pérdida de atmósfera ('stripping') y cómo el campo magnético sirve de escudo protector.",
    
    "writing_prompt": "Complete the scientific sentence: \"Kepler-186f orbits in the habitable zone. ___, stellar flares present a major risk to life.\"",
    "writing_correct": ["However", "Nevertheless", "however", "nevertheless"]
  },
  {
    "topic": "Civilizaciones del Pasado",
    "title": "Arqueología: El Cemento de la Antigua Roma",
    "reading_text": "**The Longevity of Roman Marine Concrete**\n\nWhile modern concrete structures frequently degrade in saltwater environments within decades, ancient Roman harbor structures have survived intact for over two millennia. For decades, archaeologists and materials scientists were puzzled by this durability. Mineralogical analysis of Roman marine concrete—composed of volcanic ash, quicklime, and seawater—reveals the formation of a rare mineral called aluminous tobermorite. When seawater penetrates the concrete, it dissolves the volcanic crystals and precipitates tobermorite. This mineral crystallization actually reinforces the concrete matrix over time, turning seawater from a corrosive agent into a catalyst for structural structural integrity.",
    "reading_q1": "What is the main reason for the extreme durability of Roman marine concrete?",
    "reading_q1_opts": [
      "It is sealed with an impermeable modern chemical coating.",
      "Seawater penetration causes the growth of reinforcing minerals like tobermorite.",
      "It completely prevents any water from entering the inner chambers.",
      "The concrete is kept in dry, arid underground environments."
    ],
    "reading_q1_correct": "Seawater penetration causes the growth of reinforcing minerals like tobermorite.",
    "reading_q1_explain": "El texto explica que cuando el agua marina penetra, disuelve los cristales y precipita tobermorita ('precipitates tobermorite'), reforzando la estructura.",
    
    "reading_q2": "What is the closest meaning of the word **durability** in context?",
    "reading_q2_opts": ["Fragility", "Endurance / Longevity", "Aesthetic value", "Porosity"],
    "reading_q2_correct": "Endurance / Longevity",
    "reading_q2_explain": "En el contexto de estructuras que sobreviven miles de años, 'durability' se refiere a la longevidad y resistencia estructural.",

    "lecture_title": "Lecture on Archaeological Surveying Techniques",
    "lecture_audio": "Professor: Let's focus on LiDAR, which stands for Light Detection and Ranging. LiDAR uses laser pulses emitted from an airplane to map the topography of the forest floor. By measuring the time it takes for laser beams to bounce back, scientists can create highly precise 3D maps. This technology has revolutionized archaeology by revealing hidden Roman roads and settlements deep beneath thick forest canopies without the need for manual excavation.",
    "lecture_q1": "What is the main purpose of the lecture on LiDAR?",
    "lecture_q1_opts": [
      "To describe the history of Roman road construction.",
      "To explain how laser pulse technology maps hidden archaeological ruins.",
      "To criticize manual excavations in tropical environments.",
      "To analyze the cost of hiring mapping airplanes."
    ],
    "lecture_q1_correct": "To explain how laser pulse technology maps hidden archaeological ruins.",
    "lecture_q1_explain": "El profesor describe el uso de pulsos láser (LiDAR) para mapear la topografía del bosque y revelar calzadas y asentamientos antiguos ocultos.",
    
    "writing_prompt": "Complete the scientific sentence: \"Roman harbor ruins survived for two millennia. ___, modern concrete structures degrade in decades.\"",
    "writing_correct": ["In contrast", "Conversely", "in contrast", "conversely"]
  },
  {
    "topic": "Conservación del Medio",
    "title": "Ecología: La Acidificación de los Océanos",
    "reading_text": "**The Chemistry of Ocean Acidification**\n\nOcean acidification is often termed 'the other carbon dioxide problem,' representing a major threat to global marine ecosystems. As human activities release massive quantities of carbon dioxide (CO2) into the atmosphere, nearly thirty percent is absorbed by the world's oceans. When CO2 dissolves in seawater, it reacts to form carbonic acid, which subsequently releases hydrogen ions. These free hydrogen ions combine with carbonate ions, reducing their availability for calcifying organisms. Organisms such as corals, clams, and microscopic plankton rely on carbonate to build their protective calcium carbonate shells, meaning acidification directly hinders their growth and weakens marine food webs.",
    "reading_q1": "According to the passage, what chemical reaction harms calcifying organisms?",
    "reading_q1_opts": [
      "Corals absorb excessive amounts of volatile hydrogen gas.",
      "Free hydrogen ions deplete the carbonate ions needed to build shells.",
      "Carbonic acid dissolves the volcanic quicklime in coral reef bases.",
      "Microscopic plankton convert carbon dioxide into oxygen bubbles."
    ],
    "reading_q1_correct": "Free hydrogen ions deplete the carbonate ions needed to build shells.",
    "reading_q1_explain": "El texto detalla que los iones de hidrógeno libre se combinan con los de carbonato ('hydrogen ions combine with carbonate ions'), reduciendo su disponibilidad para hacer caparazones.",
    
    "reading_q2": "What is the closest meaning of the word **hinders** in context?",
    "reading_q2_opts": ["Accelerates", "Promotes", "Obstructs / Impedes", "Validates"],
    "reading_q2_correct": "Obstructs / Impedes",
    "reading_q2_explain": "En el contexto de dificultar el crecimiento de conchas y corales, 'hinders' significa obstruir, impedir o dificultar ('obstructs').",

    "lecture_title": "Lecture on Reef Restoration & Coral Bleaching",
    "lecture_audio": "Professor: Marine biologists are using micro-fragmentation to restore dying reefs. Scientists cut live coral colonies into tiny pieces, which stimulates rapid growth rates up to forty times faster than normal. These micro-fragments are grown in labs and then transplanted onto degraded ocean reefs. This technique helps rebuild habitats that were bleached by rising seawater temperatures.",
    "lecture_q1": "What restoration method does the professor describe?",
    "lecture_q1_opts": [
      "Importing cold water from deep-sea hydrothermal vents.",
      "Rebuilding reefs using micro-fragments of live corals.",
      "Spraying chemical solutions to lower the ocean's acidity.",
      "Introducing new species of calcifying clams to the ecosystem."
    ],
    "lecture_q1_correct": "Rebuilding reefs using micro-fragments of live corals.",
    "lecture_q1_explain": "El profesor detalla la técnica de micro-fragmentación, la cual corta corales vivos en pedazos pequeños para acelerar su crecimiento y trasplantarlos.",
    
    "writing_prompt": "Complete the scientific sentence: \"Ocean acidification depletes carbonate ions. ___, calcifying corals struggle to grow.\"",
    "writing_correct": ["Consequently", "Therefore", "consequently", "therefore"]
  },
  {
    "topic": "Dinámicas de Conducta",
    "title": "Psicología: El Aprendizaje Social en Primates",
    "reading_text": "**Cognitive Mechanisms of Social Transmission**\n\nFor decades, cognitive psychologists believed that complex imitation was a uniquely human developmental trait. However, comparative studies of primate behavior have demonstrated that chimpanzees display sophisticated social transmission protocols. When a alpha member in a group invents a new foraging technique—such as using a modified twig to extract termites from a mound—other members observe the action and replicate the exact motor sequences. This is not simple associative learning; rather, it involves active cognitive mapping, where the observer understands the goal of the model and modifies their physical behavior to match it, forming a primitive cultural lineage.",
    "reading_q1": "According to the passage, what does social transmission in chimpanzees involve?",
    "reading_q1_opts": [
      "Simple associative learning that occurs purely by chance.",
      "Active cognitive mapping of another member's goal and actions.",
      "Physical migration to new territories to find safety equipment.",
      "A complete lack of cultural lineage or developmental traits."
    ],
    "reading_q1_correct": "Active cognitive mapping of another member's goal and actions.",
    "reading_q1_explain": "El texto explica que no es un simple aprendizaje asociativo, sino que implica un mapa cognitivo activo ('active cognitive mapping') para entender la meta.",
    
    "reading_q2": "What is the closest meaning of the word **replicate** in context?",
    "reading_q2_opts": ["Ignore", "Alter", "Copy / Duplicate", "Explain"],
    "reading_q2_correct": "Copy / Duplicate",
    "reading_q2_explain": "El texto dice que observan y replican ('replicate') las secuencias motoras, lo que significa duplicar o copiar la acción.",

    "lecture_title": "Lecture on Primate Vocal Communication & Signals",
    "lecture_audio": "Professor: We previously believed animal calls were purely emotional responses. However, recent recordings of vervet monkeys show semantic communication. Vervet monkeys produce distinct alarm calls depending on the predator. An aerial alarm call for eagles causes the troop to look up and run into low bushes, while a terrestrial alarm for leopards makes them climb high branches. This shows referential signaling, where calls represent external objects.",
    "lecture_q1": "What is the main takeaway of the research on vervet monkeys?",
    "lecture_q1_opts": [
      "Their alarm calls are identical across all types of threats.",
      "They communicate semantic warnings that describe specific predators.",
      "They learn to imitate human voices in university research labs.",
      "They do not rely on vocal signals to maintain safety."
    ],
    "lecture_q1_correct": "They communicate semantic warnings that describe specific predators.",
    "lecture_q1_explain": "El profesor detalla que emiten llamados de alarma distintos según el depredador ('distinct alarm calls depending on the predator'), lo cual representa comunicación semántica.",
    
    "writing_prompt": "Complete the scientific sentence: \"Chimpanzees actively observe foraging techniques. ___, they can copy the exact motor sequences.\"",
    "writing_correct": ["As a result", "Thus", "as a result", "thus"]
  },
  {
    "topic": "Paleontología y Orígenes",
    "title": "Paleobiología: La Termorregulación de los Dinosaurios",
    "reading_text": "**Endothermy vs. Ectothermy in the Mesozoic**\n\nThe metabolic status of Mesozoic dinosaurs has been a major debate in paleobiology. Historically, dinosaurs were classified as slow, cold-blooded ectotherms, similar to modern reptiles. However, histological analysis of fossilized dinosaur bones has revealed dense networks of Haversian canals and blood vessels, which are characteristic of fast-growing, warm-blooded endotherms. Furthermore, oxygen isotope ratios preserved in dinosaur tooth enamel show minimal variation across different seasons, suggesting they maintained a stable internal core temperature. This combination of vascular structure and isotopic evidence indicates they possessed an intermediate active metabolism, often termed mesothermy.",
    "reading_q1": "What do the histological analyses of dinosaur bones suggest about their metabolism?",
    "reading_q1_opts": [
      "They had no blood vessels or vascular structures.",
      "They had slow, sluggish metabolic rates similar to modern lizards.",
      "They possessed dense bone canals indicating warm-blooded endothermy.",
      "They could change their internal temperature during winter seasons."
    ],
    "reading_q1_correct": "They possessed dense bone canals indicating warm-blooded endothermy.",
    "reading_q1_explain": "El análisis histológico revela densos canales de Haversian y vasos sanguíneos ('dense networks of Haversian canals'), típicos de endotermos.",
    
    "reading_q2": "What is the closest meaning of the word **stable** in context?",
    "reading_q2_opts": ["Fluctuating", "Consistent / Unvarying", "Fragile", "External"],
    "reading_q2_correct": "Consistent / Unvarying",
    "reading_q2_explain": "En el contexto de mantener la misma temperatura del núcleo corporal a lo largo de las estaciones, 'stable' significa consistente o invariable.",

    "lecture_title": "Lecture on Feather Preservation in fossil records",
    "lecture_audio": "Professor: The discovery of non-avian theropod fossils with preserved feather structures has revolutionized paleontology. These proto-feathers were not designed for flight, as they lacked the asymmetrical design required for aerodynamic lift. Instead, they served as insulation to prevent heat loss, supporting the hypothesis that these predatory dinosaurs had warm-blooded, active metabolisms.",
    "lecture_q1": "What primary function did proto-feathers serve in theropods?",
    "lecture_q1_opts": [
      "They allowed massive theropods to fly over forests.",
      "They provided thermal insulation to maintain body heat.",
      "They acted as sensory organs to detect prey movements.",
      "They helped dinosaurs swim across deep ocean trenches."
    ],
    "lecture_q1_correct": "They provided thermal insulation to maintain body heat.",
    "lecture_q1_explain": "El profesor indica que servían de aislamiento térmico para prevenir la pérdida de calor ('insulation to prevent heat loss').",
    
    "writing_prompt": "Complete the scientific sentence: \"Proto-feathers prevented heat loss. ___, they supported active metabolic rates.\"",
    "writing_correct": ["Therefore", "Consequently", "therefore", "consequently"]
  },
  {
    "topic": "Avances de Física Moderna",
    "title": "Física: La Paradoja de la Información en Agujeros Negros",
    "reading_text": "**Quantum Mechanics and Event Horizons**\n\nThe black hole information paradox represents one of the greatest conflicts in modern theoretical physics. According to classical general relativity, anything that crosses the event horizon is permanently trapped, and no information can escape. However, quantum field theory calculations by Stephen Hawking revealed that black holes emit thermal radiation, causing them to slowly lose mass and eventually evaporate. If a black hole evaporates completely, the quantum information of the matter that fell in would be destroyed. This directly violates the principle of quantum unitarity, which states that physical information must always be preserved, suggesting our understanding of space-time is incomplete.",
    "reading_q1": "Why is the evaporation of black holes a paradox for physicists?",
    "reading_q1_opts": [
      "It proves that Stephen Hawking's calculations were incorrect.",
      "It violates the quantum principle that physical information cannot be destroyed.",
      "It suggests that black holes do not actually possess event horizons.",
      "It shows that black holes gain mass when emitting thermal radiation."
    ],
    "reading_q1_correct": "It violates the quantum principle that physical information cannot be destroyed.",
    "reading_q1_explain": "La evaporación plantea que la información se destruiría, lo cual viola el principio de unitariedad cuántica ('quantum unitarity') de conservación de información.",
    
    "reading_q2": "What is the closest meaning of the word **evaporate** in context?",
    "reading_q2_opts": ["Freeze", "Expand", "Dissipate / Disappear", "Stabilize"],
    "reading_q2_correct": "Dissipate / Disappear",
    "reading_q2_explain": "En el contexto de perder masa lentamente hasta desaparecer, 'evaporate' significa disiparse o desaparecer por completo.",

    "lecture_title": "Lecture on Quantum Entanglement & Spacetime",
    "lecture_audio": "Professor: Theoretical physicists are exploring if spacetime is an emergent property of quantum entanglement. Entanglement is a state where two particles remain connected regardless of distance. Recent models suggest that the smooth fabric of Einstein's gravitational field is held together by quantum connections. If we cut the entanglement between regions, the spacetime geometry falls apart.",
    "lecture_q1": "What emergent property of spacetime does the professor discuss?",
    "lecture_q1_opts": [
      "Spacetime is created and held together by quantum entanglement.",
      "Einstein's gravitational field is completely independent of quantum mechanics.",
      "Spacetime expands faster when particles are disconnected.",
      "Entangled particles can travel back in time to change events."
    ],
    "lecture_q1_correct": "Spacetime is created and held together by quantum entanglement.",
    "lecture_q1_explain": "El profesor discute si el espacio-tiempo es una propiedad emergente sostenida por conexiones cuánticas de entrelazamiento.",
    
    "writing_prompt": "Complete the scientific sentence: \"Classical relativity claims information is trapped. ___, quantum physics requires preservation.\"",
    "writing_correct": ["On the other hand", "However", "on the other hand", "however"]
  },
  {
    "topic": "Expresión e Historia Artística",
    "title": "Historia del Arte: La Técnica del Claroscuro en Caravaggio",
    "reading_text": "**The Revolution of Tenebrism in Baroque Painting**\n\nIn late Renaissance and early Baroque painting, artists shifted from balanced classical lighting to dramatic high-contrast techniques. The pioneer of this revolution was Michelangelo Merisi da Caravaggio, who perfected the technique of chiaroscuro, often referred to as tenebrism. Tenebrism uses deep, absolute shadows to swallow the background, while a single intense shaft of light illuminates the main figures. This dramatic contrast creates a theatrical environment that focuses the viewer's eye on the raw physical and emotional reality of the scene. Rather than idealizing figures, Caravaggio depicted saints with dirty feet and wrinkled skin, breaking Renaissance taboos.",
    "reading_q1": "What is the primary effect of Caravaggio's use of tenebrism?",
    "reading_q1_opts": [
      "It makes the background look extremely bright and colorful.",
      "It focuses attention on raw emotional reality through dramatic high-contrast lighting.",
      "It creates symmetrical geometric shapes common in classical Greek art.",
      "It completely hides the main figures in deep, absolute shadows."
    ],
    "reading_q1_correct": "It focuses attention on raw emotional reality through dramatic high-contrast lighting.",
    "reading_q1_explain": "El texto explica que el claroscuro/tenebrismo usa contrastes dramáticos ('dramatic contrast') para centrar el ojo en la cruda realidad física y emocional.",
    
    "reading_q2": "What is the closest meaning of the word **pioneer** in context?",
    "reading_q2_opts": ["Follower", "Trailblazer / Innovator", "Opponent", "Historian"],
    "reading_q2_correct": "Trailblazer / Innovator",
    "reading_q2_explain": "Al ser el iniciador y perfeccionador de una nueva técnica artística revolucionaria, 'pioneer' significa pionero, innovador o precursor ('trailblazer').",

    "lecture_title": "Lecture on Renaissance Fresco Techniques",
    "lecture_audio": "Professor: Unlike oil painting, fresco painting requires laying down plaster on a wall and painting directly on it while it is wet. The chemical reaction between the calcium hydroxide in the plaster and the pigments binds the paint permanently to the wall. This requires extreme speed, as the artist must complete the section before the plaster dries.",
    "lecture_q1": "What is the primary technical challenge of fresco painting?",
    "lecture_q1_opts": [
      "Mixing oil pigments with saltwater solutions.",
      "Painting on wet plaster before it dries and sets.",
      "Removing the dried paint from stone walls.",
      "Carving deep channels to hold the plaster brackets."
    ],
    "lecture_q1_correct": "Painting on wet plaster before it dries and sets.",
    "lecture_q1_explain": "El profesor detalla que pintar al fresco exige pintar sobre el yeso húmedo ('painting directly on it while it is wet') antes de que se seque.",
    
    "writing_prompt": "Complete the scientific sentence: \"Oil paintings can be retouched for weeks. ___, frescoes must be painted quickly before the plaster dries.\"",
    "writing_correct": ["In contrast", "Conversely", "in contrast", "conversely"]
  },
  {
    "topic": "Historia de la Economía",
    "title": "Economía: El Surgimiento de los Bancos en Venecia",
    "reading_text": "**Venetian Finance and Commercial Expansion**\n\nDuring the high Middle Ages, the Republic of Venice established a commercial monopoly across the Mediterranean, making it the wealthiest city-state in Europe. To facilitate international trade, Venetian merchants developed sophisticated banking networks. Rather than carrying heavy gold and silver coins across dangerous trade routes, merchants deposited their funds in Venice and received bills of exchange. These early paper documents allowed merchants to travel abroad and withdraw equivalent local currencies in foreign ports. This system minimized the risk of robbery and dramatically accelerated transaction speeds, serving as the direct precursor to modern paper currency.",
    "reading_q1": "What problem did the introduction of bills of exchange solve for Venetian merchants?",
    "reading_q1_opts": [
      "It allowed them to trade without paying any local taxes.",
      "It eliminated the risk of carrying heavy coins on dangerous routes.",
      "It prevented foreign ports from changing currency rates.",
      "It allowed merchants to buy ships using digital gold."
    ],
    "reading_q1_correct": "It eliminated the risk of carrying heavy coins on dangerous routes.",
    "reading_q1_explain": "El texto explica que en lugar de llevar pesadas monedas ('rather than carrying heavy coins across dangerous routes'), los comerciantes usaban letras de cambio.",
    
    "reading_q2": "What is the closest meaning of the word **facilitate** in context?",
    "reading_q2_opts": ["Hinder", "Simulate", "Ease / Assist", "Investigate"],
    "reading_q2_correct": "Ease / Assist",
    "reading_q2_explain": "En el contexto de hacer más sencillo o viable el comercio internacional, 'facilitate' significa facilitar, asistir o aliviar ('ease').",

    "lecture_title": "Lecture on the Silk Road & Trade Alliances",
    "lecture_audio": "Professor: The Silk Road was not a single highway, but a vast network of land and sea routes. To secure safety, merchants formed coalitions known as caravan guilds. These guilds negotiated protection rights with local rulers along the route, showing that early economic institutions were focused on minimizing risks and securing security.",
    "lecture_q1": "What was the main function of caravan guilds along the Silk Road?",
    "lecture_q1_opts": [
      "To map new geography in central Asia.",
      "To negotiate safety and protection rights for merchants.",
      "To construct high-speed stone roads for military use.",
      "To monopolize the production of silk fabrics."
    ],
    "lecture_q1_correct": "To negotiate safety and protection rights for merchants.",
    "lecture_q1_explain": "El profesor explica que los gremios (caravan guilds) negociaban derechos de protección ('protection rights') con gobernantes locales para asegurar el viaje.",
    
    "writing_prompt": "Complete the scientific sentence: \"Bills of exchange minimized the risk of robbery. ___, they accelerated international transaction speeds.\"",
    "writing_correct": ["Furthermore", "Moreover", "furthermore", "moreover"]
  },
  {
    "topic": "Genética y Biología Molecular",
    "title": "Biología: El Sistema CRISPR-Cas9 y la Edición Genética",
    "reading_text": "**CRISPR-Cas9 as a Molecular Scissor**\n\nThe development of the CRISPR-Cas9 gene editing platform represents a monumental breakthrough in biotechnology. Derived from a primitive immune system in bacteria, CRISPR uses a guide RNA molecule to locate a highly specific sequence of DNA within a genome. Once the target sequence is identified, the Cas9 enzyme acts as a molecular scissor, creating a double-strand break in the DNA. The cell's natural repair mechanisms then mend the break, during which scientists can delete, insert, or modify genes. While this technology holds immense potential to cure hereditary genetic diseases, it raises ethical concerns regarding off-target mutations and germline modifications.",
    "reading_q1": "How does the CRISPR-Cas9 system perform gene editing?",
    "reading_q1_opts": [
      "It floods the cell nucleus with synthetic volcanic ash to mutate genes.",
      "It uses guide RNA to find a DNA sequence, and Cas9 cuts it to allow repair.",
      "It permanently blocks the cell from performing chemical outgassing.",
      "It replaces the entire cell genome with guide RNA molecules."
    ],
    "reading_q1_correct": "It uses guide RNA to find a DNA sequence, and Cas9 cuts it to allow repair.",
    "reading_q1_explain": "El texto explica que el CRISPR usa un ARN guía para localizar la secuencia ('guide RNA molecule to locate') y la enzima Cas9 la corta ('Cas9 enzyme acts as a scissor').",
    
    "reading_q2": "What is the closest meaning of the word **breakthrough** in context?",
    "reading_q2_opts": ["Failure", "Major discovery / Milestone", "Hereditary illness", "Temporary setup"],
    "reading_q2_correct": "Major discovery / Milestone",
    "reading_q2_explain": "Al referirse a un logro o avance revolucionario e histórico en la biotecnología, 'breakthrough' significa un gran descubrimiento o hito ('major discovery').",

    "lecture_title": "Lecture on Ribosomes & Protein Synthesis",
    "lecture_audio": "Professor: Ribosomes are the cell's molecular factories. They read messenger RNA and assemble amino acids into complex protein chains. This translation process is highly precise. However, if a single nucleotide mutation is present, the ribosome may produce a dysfunctional protein, which is the root cause of many genetic disorders.",
    "lecture_q1": "What function do ribosomes perform in the cell?",
    "lecture_q1_opts": [
      "They duplicate DNA double strands during cell division.",
      "They read messenger RNA to synthesize protein chains.",
      "They act as Guide RNA to detect viruses.",
      "They dissolve carbonic acid inside the cell mitochondria."
    ],
    "lecture_q1_correct": "They read messenger RNA to synthesize protein chains.",
    "lecture_q1_explain": "El profesor detalla que los ribosomas actúan como fábricas celulares que leen el ARN mensajero y ensamblan aminoácidos para sintetizar proteínas.",
    
    "writing_prompt": "Complete the scientific sentence: \"CRISPR-Cas9 can cure genetic diseases. ___, off-target mutations remain a major safety concern.\"",
    "writing_correct": ["However", "Nevertheless", "however", "nevertheless"]
  },
  {
    "topic": "Cómputo e Inteligencia Artificial",
    "title": "Tecnología: Redes Neuronales y Aprendizaje Profundo",
    "reading_text": "**Deep Learning and Artificial Neural Networks**\n\nArtificial neural networks are computational models loosely inspired by the structure of the human brain. These networks consist of thousands of interconnected nodes, or artificial neurons, arranged in multiple hidden layers. In a deep learning framework, data is passed through these layers, where each connection is assigned a specific weight. During the training phase, the network adjusts these weights using a process called backpropagation to minimize errors. Through this iterative feedback loop, deep neural networks can identify incredibly subtle patterns in high-dimensional datasets, enabling major breakthroughs in voice recognition, computer vision, and predictive analytics.",
    "reading_q1": "How do artificial neural networks improve their accuracy during training?",
    "reading_q1_opts": [
      "They increase the physical speed of the computer processor.",
      "They adjust connection weights using backpropagation to minimize errors.",
      "They delete the hidden layers to make the network structure flat.",
      "They rely on human programmers to manually rewrite the weights."
    ],
    "reading_q1_correct": "They adjust connection weights using backpropagation to minimize errors.",
    "reading_q1_explain": "El texto explica que durante el entrenamiento la red ajusta los pesos ('adjusts these weights') usando retropropagación ('backpropagation') para minimizar errores.",
    
    "reading_q2": "What is the closest meaning of the word **subtle** in context?",
    "reading_q2_opts": ["Obvious", "Faint / Elusive", "Harmful", "Unilateral"],
    "reading_q2_correct": "Faint / Elusive",
    "reading_q2_explain": "En el contexto de detectar patrones sumamente difíciles de percibir o sutiles en bases de datos complejas, 'subtle' significa tenue, elusivo o poco evidente ('faint').",

    "lecture_title": "Lecture on Quantum Computing Principles",
    "lecture_audio": "Professor: Unlike classical computers that store data in bits as either zeros or ones, quantum computers use qubits. Qubits can exist in a superposition of both states simultaneously. This superposition allows a quantum machine to perform massive parallel calculations, solving complex optimization problems in minutes that would take classical computers thousands of years.",
    "lecture_q1": "What is the main computational advantage of qubits over classical bits?",
    "lecture_q1_opts": [
      "They require less electricity to store data.",
      "They can exist in superposition to allow massive parallel processing.",
      "They are built from biological cells to prevent hardware errors.",
      "They completely eliminate the need for backpropagation algorithms."
    ],
    "lecture_q1_correct": "They can exist in superposition to allow massive parallel processing.",
    "lecture_q1_explain": "El profesor explica que los qubits pueden existir en superposición cuántica simultánea, permitiendo cálculos paralelos masivos de alta velocidad.",
    
    "writing_prompt": "Complete the scientific sentence: \"Superposition enables massive parallel processing. ___, entanglement binds qubits for fast calculation.\"",
    "writing_correct": ["Furthermore", "Moreover", "furthermore", "moreover"]
  }
]

# ----------------------------------------------------------------------
# 3. GENERADOR DE LESSONS CON TEMPLATES DINÁMICOS
# ----------------------------------------------------------------------
def generate_toeic_listening(v):
  v_num = v + 1
  theme = toeic_themes[v]
  return {
    "id": f"toeic_listening_v{v_num}",
    "title": f"TOEIC® Listening - Versión {v_num}: {theme['focus']}",
    "level": "B2/C1",
    "description": f"Prueba intensiva de comprensión auditiva TOEIC® enfocada en el contexto de {theme['company']} con {theme['leader']}.",
    "total_xp": 100,
    "stages": [
      {
        "id": "listening-intro",
        "type": "lecture",
        "title": "TOEIC Part 1: Strategy & Warm-up",
        "parts": [
          {
            "visual": f"## 📸 Simulación de Auditiva: {theme['company']}\n\nEvaluaremos tu destreza auditiva en el contexto de **{theme['company']}** (Líder a cargo: **{theme['leader']}**).\n\nConcéntrate plenamente en las descripciones y los audios corporativos.",
            "audio": "Welcome to this specialized TOEIC Listening drill. Listen closely to the speaker options and pick the best description of the workspace. Good luck!",
            "animation": "teacher_pointing"
          }
        ]
      },
      {
        "id": "listening-quiz",
        "type": "quiz",
        "title": "Parte 1: Photodescription & Conversations",
        "questions": [
          {
            "id": f"TL1_v{v_num}",
            "type": "quiz_choice",
            "question": f"[PART 1 - PHOTOGRAPH]: Look at the business picture of {theme['company']}'s office staff. Select the correct description.",
            "audio_script": theme["photo_desc"],
            "options": ["Statement A", "Statement B", "Statement C", "Statement D"],
            "correct_answer": theme["photo_correct"],
            "explanation": theme["photo_explain"]
          },
          {
            "id": f"TL3_v{v_num}",
            "type": "quiz_choice",
            "question": "[PART 3 - CONVERSATION]: Listen to the conversation and answer: What is the main issue discussed by the speakers?",
            "audio_script": theme["dialogue"],
            "options": [
              "The contract pricing is too high.",
              "The delivery window is too narrow for their schedule.",
              "They want to cancel the shipment.",
              "The company wants to buy ApexCRM."
            ],
            "correct_answer": "The delivery window is too narrow for their schedule.",
            "explanation": "La mujer menciona explícitamente: 'pricing is competitive, but their delivery window is too narrow for our schedule'."
          }
        ]
      }
    ]
  }

def generate_toeic_reading(v):
  v_num = v + 1
  theme = toeic_themes[v]
  return {
    "id": f"toeic_reading_v{v_num}",
    "title": f"TOEIC® Reading - Versión {v_num}: {theme['focus']}",
    "level": "B2/C1",
    "description": f"Evaluación lectora de gramática, vocabulario y correspondencia formal para {theme['company']}.",
    "total_xp": 100,
    "stages": [
      {
        "id": "reading-intro",
        "type": "lecture",
        "title": "TOEIC Reading: Strategy & Context",
        "parts": [
          {
            "visual": f"## 📖 Simulación Lectora: {theme['company']}\n\nAnalizaremos el memorándum oficial redactado por **{theme['leader']}** para la transición del software **{theme['crm']}**.\n\nLee el documento con sumo cuidado.",
            "audio": "Welcome to the Reading Section. Focus on prepositions, vocabulary in context, and direct information inside the memorandum.",
            "animation": "analyzing"
          }
        ]
      },
      {
        "id": "reading-quiz",
        "type": "quiz",
        "title": "Parte 5 y 7: Incomplete Sentences & Documents",
        "questions": [
          {
            "id": f"TR5_v{v_num}",
            "type": "quiz_choice",
            "question": f"[PART 5]: Choose the word that best completes the sentence:\n\n\"The management board at {theme['company']} decided to inspect the factory ___ to ensure high compliance.\"",
            "options": ["periodically", "periodic", "periodical", "period"],
            "correct_answer": "periodically",
            "explanation": "Se necesita el adverbio 'periodically' para modificar la acción de inspeccionar (inspect)."
          },
          {
            "id": f"TR7_v{v_num}",
            "type": "quiz_choice",
            "question": f"[PART 7]: Read the following document and answer: **What is the mandatory event's goal?**\n\n{theme['memo_text']}",
            "options": [
              "To test the internet speed in the office rooms.",
              "To undergo training and receive user accounts for the new software.",
              "To debate if they should stay with the old software.",
              "To meet their supplier for lunch."
            ],
            "correct_answer": "To undergo training and receive user accounts for the new software.",
            "explanation": "El memorando indica que la sesión es obligatoria porque las cuentas se aprovisionarán directamente ('accounts will be provisioned directly during the workshop')."
          }
        ]
      }
    ]
  }

def generate_toeic_mock(v):
  v_num = v + 1
  theme = toeic_themes[v]
  return {
    "id": f"toeic_mock_v{v_num}",
    "title": f"Simulador Oficial Completo TOEIC® - Versión {v_num}",
    "level": "B2/C1",
    "description": f"Simulador completo real de Listening & Reading enfocado en {theme['company']} y el líder {theme['leader']}.",
    "total_xp": 500,
    "stages": [
      {
        "id": "toeic-intro",
        "type": "lecture",
        "title": f"TOEIC® {theme['company']} Simulation: Instructions",
        "parts": [
          {
            "visual": f"## 📝 Simulador Oficial TOEIC® (Versión {v_num})\n\nEvaluación de **Listening & Reading** en tiempo real:\n\n1. **Listening Section**: Evalúa tu comprensión en {theme['company']} usando {theme['crm']}.\n2. **Reading Section**: Mide tu análisis gramatical de memorandos emitidos por {theme['leader']}.\n\n*Inicia tu prueba simulada oficial.*",
            "audio": "Welcome to the Full TOEIC Simulation. Manage your time efficiently across both listening and reading stages. Let's begin.",
            "animation": "teacher_pointing"
          }
        ]
      },
      {
        "id": "toeic-listening",
        "type": "quiz",
        "title": "Sección 1: Comprensión Auditiva (Listening)",
        "questions": [
          {
            "id": f"T_L1_v{v_num}",
            "type": "quiz_choice",
            "question": f"[PART 1 - PHOTO]: Select the best description of {theme['company']}'s office photo.",
            "audio_script": theme["photo_desc"],
            "options": ["Statement A", "Statement B", "Statement C", "Statement D"],
            "correct_answer": theme["photo_correct"],
            "explanation": theme["photo_explain"]
          },
          {
            "id": f"T_L3_v{v_num}",
            "type": "quiz_choice",
            "question": "[PART 3 - CONVERSATION]: Listen to the dialogue and answer: What does the man agree to do next?",
            "audio_script": theme["dialogue"],
            "options": [
              "Sign the contract as currently written.",
              "Call the manager to negotiate an extension of the delivery window.",
              "Cancel the order immediately.",
              "Write a new memorandum to sales staff."
            ],
            "correct_answer": "Call the manager to negotiate an extension of the delivery window.",
            "explanation": "El hombre dice: 'I will call their manager to negotiate an extension'."
          }
        ]
      },
      {
        "id": "toeic-reading",
        "type": "quiz",
        "title": "Sección 2: Comprensión Lectora (Reading)",
        "questions": [
          {
            "id": f"T_R5_v{v_num}",
            "type": "quiz_choice",
            "question": f"[PART 5]: Complete the business sentence correctly:\n\n\"All employees are strictly required to comply ___ the updated security rules in {theme['crm']}.\"",
            "options": ["with", "to", "by", "for"],
            "correct_answer": "with",
            "explanation": "El verbo 'comply' rige gramaticalmente la preposición 'with' (comply with / cumplir con)."
          },
          {
            "id": f"T_R7_v{v_num}",
            "type": "quiz_choice",
            "question": f"[PART 7]: Read the memorandum and answer: **When will the migration to {theme['crm']} officially occur?**\n\n{theme['memo_text']}",
            "options": [
              f"This {theme['day']} at {theme['time']}",
              f"Next {theme['day']}",
              "Immediately today",
              "Over the upcoming weekend"
            ],
            "correct_answer": f"Next {theme['day']}",
            "explanation": f"El memorando dice: 'starting next {theme['day']}, we are officially retiring our legacy sales tool and migrating to {theme['crm']}'."
          }
        ]
      }
    ]
  }

def generate_toefl_mock(v):
  v_num = v + 1
  theme = academic_themes[v]
  return {
    "id": f"toefl_mock_v{v_num}",
    "title": f"Simulador Oficial Completo TOEFL® iBT - Versión {v_num}",
    "level": "B2/C1",
    "description": f"Simulador académico completo de TOEFL® con lecturas y conferencias sobre: {theme['topic']}.",
    "total_xp": 500,
    "stages": [
      {
        "id": "toefl-intro",
        "type": "lecture",
        "title": f"TOEFL® iBT Simulation: {theme['topic']}",
        "parts": [
          {
            "visual": f"## 🎓 Simulador TOEFL® iBT (Versión {v_num})\n\nTemas académicos oficiales evaluados:\n\n- **Reading Article**: *{theme['title']}*\n- **Academic Lecture**: *{theme['lecture_title']}*\n- **Writing structure & Integration**\n\n*Comienza tu examen académico.*",
            "audio": "Welcome to the Integrated TOEFL iBT simulation. You will be tested on your ability to synthesize information from complex academic sources. Let's start.",
            "animation": "analyzing"
          }
        ]
      },
      {
        "id": "toefl-reading",
        "type": "quiz",
        "title": "Sección 1: Comprensión Lectora Académica (Reading)",
        "questions": [
          {
            "id": f"TF_R1_v{v_num}",
            "type": "quiz_choice",
            "question": f"Read the academic article and answer the question:\n\n{theme['reading_text']}",
            "options": theme["reading_q1_opts"],
            "correct_answer": theme["reading_q1_correct"],
            "explanation": theme["reading_q1_explain"]
          },
          {
            "id": f"TF_R2_v{v_num}",
            "type": "quiz_choice",
            "question": "What is the closest meaning of the target word in this academic context?",
            "options": theme["reading_q2_opts"],
            "correct_answer": theme["reading_q2_correct"],
            "explanation": theme["reading_q2_explain"]
          }
        ]
      },
      {
        "id": "toefl-listening",
        "type": "quiz",
        "title": "Sección 2: Comprensión Auditiva Académica (Listening)",
        "questions": [
          {
            "id": f"TF_L1_v{v_num}",
            "type": "quiz_choice",
            "question": f"[UNIVERSITY LECTURE]: Listen to the professor's explanation and answer: **What is the main topic?**\n\n*(Transcription)*:\n\n{theme['lecture_audio']}",
            "options": theme["lecture_q1_opts"],
            "correct_answer": theme["lecture_q1_correct"],
            "explanation": theme["lecture_q1_explain"]
          }
        ]
      },
      {
        "id": "toefl-writing-prep",
        "type": "quiz",
        "title": "Sección 3: Estructura y Coherencia Académica (Writing Prep)",
        "questions": [
          {
            "id": f"TF_W1_v{v_num}",
            "type": "fill_input",
            "question": f"Fill in the blank with the appropriate academic connector that best completes the logical flow:\n\n{theme['writing_prompt']}",
            "correct_answers": theme["writing_correct"],
            "hints": ["Check punctuation and capitalization."]
          }
        ]
      }
    ]
  }

def generate_ielts_mock(v):
  v_num = v + 1
  theme = academic_themes[v]
  return {
    "id": f"ielts_mock_v{v_num}",
    "title": f"Simulador Oficial Completo IELTS® Academic - Versión {v_num}",
    "level": "B2/C2",
    "description": f"Simulador académico completo de IELTS® con lecturas y audios sobre: {theme['topic']}.",
    "total_xp": 500,
    "stages": [
      {
        "id": "ielts-intro",
        "type": "lecture",
        "title": f"IELTS® Academic Simulation: {theme['topic']}",
        "parts": [
          {
            "visual": f"## 🇬🇧 Simulador IELTS® Academic (Versión {v_num})\n\nTemas académicos globales evaluados:\n\n- **Academic Reading**: *{theme['title']}*\n- **Academic Listening Lecture**\n- **Academic Writing Task Integration**\n\n*Comienza tu examen simulado.*",
            "audio": "Welcome to the IELTS Academic Simulator. Focus on precise spelling, syntax structure, and vocabulary diversity. Let's begin.",
            "animation": "teacher_pointing"
          }
        ]
      },
      {
        "id": "ielts-listening",
        "type": "quiz",
        "title": "Sección 1: Comprensión Auditiva (IELTS Listening)",
        "questions": [
          {
            "id": f"IE_L1_v{v_num}",
            "type": "quiz_choice",
            "question": f"[ACADEMIC LECTURE]: Listen to the dialogue and answer: **What is the central focus?**\n\n*(Transcription)*:\n\n{theme['lecture_audio']}",
            "options": theme["lecture_q1_opts"],
            "correct_answer": theme["lecture_q1_correct"],
            "explanation": theme["lecture_q1_explain"]
          }
        ]
      },
      {
        "id": "ielts-reading",
        "type": "quiz",
        "title": "Sección 2: Comprensión Lectora (IELTS Reading)",
        "questions": [
          {
            "id": f"IE_R1_v{v_num}",
            "type": "quiz_choice",
            "question": f"Read the academic article and answer the question:\n\n{theme['reading_text']}",
            "options": theme["reading_q1_opts"],
            "correct_answer": theme["reading_q1_correct"],
            "explanation": theme["reading_q1_explain"]
          },
          {
            "id": f"IE_R2_v{v_num}",
            "type": "quiz_choice",
            "question": "What is the closest meaning of the highlighted term in context?",
            "options": theme["reading_q2_opts"],
            "correct_answer": theme["reading_q2_correct"],
            "explanation": theme["reading_q2_explain"]
          }
        ]
      },
      {
        "id": "ielts-writing",
        "type": "quiz",
        "title": "Sección 3: Coherencia y Gramática Académica (IELTS Writing Prep)",
        "questions": [
          {
            "id": f"IE_W1_v{v_num}",
            "type": "fill_input",
            "question": f"Complete the sentence with the appropriate formal connector showing cause-and-effect:\n\n{theme['writing_prompt']}",
            "correct_answers": theme["writing_correct"],
            "hints": ["Check spelling and casing."]
          }
        ]
      }
    ]
  }

# ----------------------------------------------------------------------
# 4. FUNCIÓN PRINCIPAL DE ESCRITURA
# ----------------------------------------------------------------------
def main():
  print("Generando variantes reales de simuladores...")
  
  for v in range(10):
    v_num = v + 1
    
    # 1. toeic_listening
    tl_data = generate_toeic_listening(v)
    with open(os.path.join(base_dir, f"toeic_listening_v{v_num}.json"), "w", encoding="utf-8") as f:
      json.dump(tl_data, f, indent=2, ensure_ascii=False)
      
    # 2. toeic_reading
    tr_data = generate_toeic_reading(v)
    with open(os.path.join(base_dir, f"toeic_reading_v{v_num}.json"), "w", encoding="utf-8") as f:
      json.dump(tr_data, f, indent=2, ensure_ascii=False)
      
    # 3. toeic_mock
    tm_data = generate_toeic_mock(v)
    with open(os.path.join(base_dir, f"toeic_mock_v{v_num}.json"), "w", encoding="utf-8") as f:
      json.dump(tm_data, f, indent=2, ensure_ascii=False)
      
    # 4. toefl_mock
    tf_data = generate_toefl_mock(v)
    with open(os.path.join(base_dir, f"toefl_mock_v{v_num}.json"), "w", encoding="utf-8") as f:
      json.dump(tf_data, f, indent=2, ensure_ascii=False)
      
    # 5. ielts_mock
    ie_data = generate_ielts_mock(v)
    with open(os.path.join(base_dir, f"ielts_mock_v{v_num}.json"), "w", encoding="utf-8") as f:
      json.dump(ie_data, f, indent=2, ensure_ascii=False)
      
  print("¡Todas las 50 versiones reales e independientes fueron creadas con éxito!")

if __name__ == "__main__":
  main()
