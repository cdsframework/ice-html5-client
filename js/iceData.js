// select code || ': ' || display_name from cds_code where code_system_id = 'e0bc41f880dc19d217656508b6cf9908' order by int(code);
var cvxCodeSystem = '2.16.840.1.113883.12.292';
var groupCodeSystem = '2.16.840.1.113883.3.795.12.100.1';

var cvxList = [];

var cvxData = {
    '01': {'displayName': 'DTP'},
    '02': {'displayName': 'OPV'},
    '03': {'displayName': 'MMR'},
    '04': {'displayName': 'measles/rubella'},
    '05': {'displayName': 'measles'},
    '06': {'displayName': 'rubella'},
    '07': {'displayName': 'mumps'},
    '08': {'displayName': 'Hep B, adolescent or pediatric'},
    '09': {'displayName': 'Td, adult, absorbed'},
    '10': {'displayName': 'IPV'},
    '11': {'displayName': 'pertussis'},
    '15': {'displayName': 'influenza, split '},
    '16': {'displayName': 'influenza, whole'},
    '17': {'displayName': 'Hib NOS'},
    '20': {'displayName': 'DTaP'},
    '21': {'displayName': 'varicella'},
    '22': {'displayName': 'DTP-Hib'},
    '28': {'displayName': 'DT, pediatric'},
    '31': {'displayName': 'Hep A, pediatric, NOS'},
    '32': {'displayName': 'meningococcal MPSV4'},
    '33': {'displayName': 'pneumococcal polysaccharide '},
    '38': {'displayName': 'rubella/mumps'},
    '42': {'displayName': 'Hep B, adolescent/high risk infant'},
    '43': {'displayName': 'Hep B, adult'},
    '44': {'displayName': 'Hep B, dialysis'},
    '45': {'displayName': 'Hep B NOS'},
    '46': {'displayName': 'Hib (PRP-D)'},
    '47': {'displayName': 'Hib (HbOC)'},
    '48': {'displayName': 'Hib (PRP-T)'},
    '49': {'displayName': 'Hib (PRP-OMP)'},
    '50': {'displayName': 'DTaP-Hib'},
    '51': {'displayName': 'Hib-Hep B'},
    '52': {'displayName': 'Hep A, adult'},
    '62': {'displayName': 'HPV, quadrivalent'},
    '74': {'displayName': 'rotavirus, tetravalent'},
    '83': {'displayName': 'Hep A, ped/adol, 2-dose'},
    '84': {'displayName': 'Hep A, ped/adol, 3-dose'},
    '85': {'displayName': 'Hep A NOS'},
    '88': {'displayName': 'influenza NOS'},
    '89': {'displayName': 'polio NOS'},
    '94': {'displayName': 'MMR-Varicella'},
    '100': {'displayName': 'pneumococcal conjugate PCV 7'},
    '102': {'displayName': 'DTP-Hib-Hep B'},
    '103': {'displayName': 'meningococcal C conjugate'},
    '104': {'displayName': 'Hep A-Hep B'},
    '106': {'displayName': 'DTaP, 5 pertussis antigens'},
    '107': {'displayName': 'DTaP NOS'},
    '108': {'displayName': 'meningococcal NOS'},
    '109': {'displayName': 'pneumococcal NOS'},
    '110': {'displayName': 'DTaP-Hep B-IPV'},
    '111': {'displayName': 'influenza, live, intranasal'},
    '113': {'displayName': 'Td, adult, preservative free'},
    '114': {'displayName': 'meningococcal MCV4P'},
    '115': {'displayName': 'Tdap'},
    '116': {'displayName': 'rotavirus, pentavalent'},
    '118': {'displayName': 'HPV, bivalent'},
    '119': {'displayName': 'rotavirus, monovalent'},
    '120': {'displayName': 'DTaP-Hib-IPV'},
    '122': {'displayName': 'rotavirus NOS'},
    '125': {'displayName': 'H1N1-09, nasal'},
    '126': {'displayName': 'H1N1-09, preservative-free'},
    '127': {'displayName': 'H1N1-09, injectable'},
    '128': {'displayName': 'H1N1-09 NOS'},
    '130': {'displayName': 'DTaP-IPV'},
    '133': {'displayName': 'pneumococcal conjugate PCV 13'},
    '135': {'displayName': 'influenza, high dose '},
    '136': {'displayName': 'meningococcal MCV4O'},
    '137': {'displayName': 'HPV NOS'},
    '138': {'displayName': 'Td, not adsorbed'},
    '139': {'displayName': 'Td, adult NOS'},
    '140': {'displayName': 'influenza, injectable, preservative-free'},
    '141': {'displayName': 'influenza, injectable'},
    '144': {'displayName': 'influenza, intradermal, preservative-free'},
    '147': {'displayName': 'meningococcal MCV4 NOS'},
    '148': {'displayName': 'meningococcal C/Y-HIB PRP'},
    '149': {'displayName': 'influenza, live, intranasal, quadrivalent'},
    '150': {'displayName': 'Influenza, injectable, quadrivalent (IIV4), preservative free'},
    '151': {'displayName': 'influenza nasal, unspecified formulation'},
    '153': {'displayName': 'Influenza, injectable, MDCK, (ccIIV3), trivalent, preservative free'},
    '155': {'displayName': 'influenza, recombinant, inj., preservative-free'},
    '158': {'displayName': 'Influenza-IIV4, IM (>3yrs)'},
    '161': {'displayName': 'Influenza, IIV4, IM, Presrv-free (Ped)'}};

function getCvxData() {
    var cvxCode;
    if (cvxList.length === 0) {
        for (cvxCode in cvxData) {
            cvxList[cvxList.length] = cvxCode + ': ' + cvxData[cvxCode]['displayName'];
        }
    }
    return cvxList;
}

var vaccineGroups = {
    '100': 'HepB',
    '200': 'DTP',
    '300': 'Hib',
    '400': 'Polio',
    '500': 'MMR',
    '600': 'Varicella',
    '700': 'Pneumococcal Conjugate',
    '720': 'Pneumococcal Polysaccharide',
    '800': 'Influenza',
    '810': 'HepA',
    '820': 'Rotavirus',
    '830': 'Meningococcal',
    '840': 'Human Papillomavirus',
    '890': 'H1N1 Influenza'
};

var defaultPatientList = '{"95f6340e-c51e-10e1-0337-7d8c66f1fb52":{"firstName":"Yogi","lastName":"Bear","gender":"M","dob":"20091130","id":"95f6340e-c51e-10e1-0337-7d8c66f1fb52","izs":[["14c5c7b8-ba82-f0f1-5651-6edff3905879","20091130","127: H1N1-09, injectable"],["58c2882d-2ccc-b344-d541-069c0092b72a","20100212","127: H1N1-09, injectable"],["0d1224e4-3a09-86b2-77a0-d92e2dc80d56","20100827","127: H1N1-09, injectable"],["f45a8fd1-b952-1e2b-8ef7-b500bcdcc5d3","20101002","88: influenza NOS"],["ae9b5ce3-57b2-b258-13cb-fea54509ee69","20120103","88: influenza NOS"],["88080581-02cf-7af8-60c0-0b09c8636596","20120126","43: Hep B, adult"],["4fb582e8-0821-6001-a9a5-25498ef66f9b","20120209","107: DTaP NOS"],["6e97e755-590a-c34a-9ddd-5230a034369e","20130103","94: MMR-Varicella"],["b089f223-a57b-141e-1f82-03de11e7da9b","20130103","03: MMR"],["d6b8a0ab-89a9-34d5-3e17-f67210814c98","",""]]}}';