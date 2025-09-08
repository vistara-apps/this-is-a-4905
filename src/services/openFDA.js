class OpenFDAService {
  constructor() {
    this.baseUrl = 'https://api.fda.gov'
  }

  /**
   * Search for drug information
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Drug information
   */
  async searchDrugs(query, limit = 10) {
    try {
      const params = new URLSearchParams({
        search: query,
        limit: limit.toString()
      })

      const response = await fetch(`${this.baseUrl}/drug/drugsfda.json?${params}`)
      const data = await response.json()

      if (data.results) {
        return data.results.map(drug => ({
          id: drug.application_number,
          brandName: drug.openfda?.brand_name?.[0] || 'Unknown',
          genericName: drug.openfda?.generic_name?.[0] || 'Unknown',
          manufacturer: drug.openfda?.manufacturer_name?.[0] || 'Unknown',
          activeIngredient: drug.openfda?.substance_name?.[0] || 'Unknown',
          dosageForm: drug.openfda?.dosage_form?.[0] || 'Unknown',
          route: drug.openfda?.route?.[0] || 'Unknown'
        }))
      }

      return []
    } catch (error) {
      console.error('OpenFDA drug search error:', error)
      return this.getMockDrugData(query)
    }
  }

  /**
   * Search for device recalls
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Device recall information
   */
  async searchDeviceRecalls(query, limit = 10) {
    try {
      const params = new URLSearchParams({
        search: query,
        limit: limit.toString()
      })

      const response = await fetch(`${this.baseUrl}/device/recall.json?${params}`)
      const data = await response.json()

      if (data.results) {
        return data.results.map(recall => ({
          id: recall.recall_number,
          productDescription: recall.product_description,
          reason: recall.reason_for_recall,
          recallDate: recall.recall_initiation_date,
          classification: recall.classification,
          status: recall.status,
          company: recall.recalling_firm
        }))
      }

      return []
    } catch (error) {
      console.error('OpenFDA device recall search error:', error)
      return this.getMockRecallData(query)
    }
  }

  /**
   * Get health program information (mock implementation)
   * This would typically integrate with local health department APIs
   * @param {string} location - Location to search for programs
   * @returns {Promise<Array>} - Health program information
   */
  async getHealthPrograms(location) {
    try {
      // In a real implementation, this would call local health department APIs
      // For now, we'll return mock data based on location
      return this.getMockHealthPrograms(location)
    } catch (error) {
      console.error('Health programs search error:', error)
      return this.getMockHealthPrograms(location)
    }
  }

  /**
   * Search for food recalls
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} - Food recall information
   */
  async searchFoodRecalls(query, limit = 10) {
    try {
      const params = new URLSearchParams({
        search: query,
        limit: limit.toString()
      })

      const response = await fetch(`${this.baseUrl}/food/recall.json?${params}`)
      const data = await response.json()

      if (data.results) {
        return data.results.map(recall => ({
          id: recall.recall_number,
          productDescription: recall.product_description,
          reason: recall.reason_for_recall,
          recallDate: recall.recall_initiation_date,
          classification: recall.classification,
          status: recall.status,
          company: recall.recalling_firm,
          distribution: recall.distribution_pattern
        }))
      }

      return []
    } catch (error) {
      console.error('OpenFDA food recall search error:', error)
      return this.getMockFoodRecallData(query)
    }
  }

  // Mock data methods for development/fallback
  getMockDrugData(query) {
    return [
      {
        id: 'NDA021436',
        brandName: 'Lipitor',
        genericName: 'atorvastatin calcium',
        manufacturer: 'Pfizer Inc',
        activeIngredient: 'atorvastatin calcium',
        dosageForm: 'tablet',
        route: 'oral'
      },
      {
        id: 'NDA020702',
        brandName: 'Plavix',
        genericName: 'clopidogrel bisulfate',
        manufacturer: 'Bristol-Myers Squibb',
        activeIngredient: 'clopidogrel bisulfate',
        dosageForm: 'tablet',
        route: 'oral'
      }
    ].filter(drug => 
      drug.brandName.toLowerCase().includes(query.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(query.toLowerCase())
    )
  }

  getMockRecallData(query) {
    return [
      {
        id: 'Z-1234-2024',
        productDescription: 'Blood Glucose Monitoring System',
        reason: 'Potential for inaccurate readings',
        recallDate: '2024-01-15',
        classification: 'Class II',
        status: 'Ongoing',
        company: 'Medical Device Corp'
      }
    ]
  }

  getMockFoodRecallData(query) {
    return [
      {
        id: 'F-5678-2024',
        productDescription: 'Organic Baby Food',
        reason: 'Potential contamination with heavy metals',
        recallDate: '2024-01-10',
        classification: 'Class I',
        status: 'Completed',
        company: 'Healthy Foods Inc',
        distribution: 'Nationwide'
      }
    ]
  }

  getMockHealthPrograms(location) {
    const programs = [
      {
        programId: 'hp_001',
        name: 'Free Health Screenings',
        description: 'Comprehensive health screenings including blood pressure, cholesterol, and diabetes testing.',
        eligibility: 'Open to all residents, no insurance required',
        location: 'San Francisco Community Health Center',
        contactInfo: {
          phone: '(415) 555-0123',
          email: 'screenings@sfhealth.org',
          website: 'https://sfhealth.org/screenings'
        },
        schedule: 'First Saturday of every month, 9 AM - 3 PM',
        category: 'Preventive Care'
      },
      {
        programId: 'hp_002',
        name: 'Vaccination Clinic',
        description: 'Free and low-cost vaccinations for children and adults, including flu shots, COVID-19 vaccines, and routine immunizations.',
        eligibility: 'All ages, sliding scale fees based on income',
        location: 'Multiple locations throughout San Francisco',
        contactInfo: {
          phone: '(415) 555-0456',
          email: 'vaccines@sfhealth.org',
          website: 'https://sfhealth.org/vaccines'
        },
        schedule: 'Walk-in hours: Monday-Friday 8 AM - 4 PM',
        category: 'Immunizations'
      },
      {
        programId: 'hp_003',
        name: 'Mental Health Support Groups',
        description: 'Free support groups for anxiety, depression, grief, and substance abuse recovery.',
        eligibility: 'Open to all adults 18+',
        location: 'SF Mental Health Center',
        contactInfo: {
          phone: '(415) 555-0789',
          email: 'support@sfmentalhealth.org',
          website: 'https://sfmentalhealth.org/groups'
        },
        schedule: 'Various times throughout the week',
        category: 'Mental Health'
      },
      {
        programId: 'hp_004',
        name: 'Senior Wellness Program',
        description: 'Health and wellness activities for seniors including fitness classes, nutrition education, and social activities.',
        eligibility: 'Adults 65 and older',
        location: 'SF Senior Center',
        contactInfo: {
          phone: '(415) 555-0321',
          email: 'wellness@sfseniors.org',
          website: 'https://sfseniors.org/wellness'
        },
        schedule: 'Monday, Wednesday, Friday 10 AM - 2 PM',
        category: 'Senior Care'
      },
      {
        programId: 'hp_005',
        name: 'Maternal Health Services',
        description: 'Prenatal care, childbirth education, and postpartum support for expectant and new mothers.',
        eligibility: 'Pregnant women and new mothers, income-based eligibility',
        location: 'SF Women\'s Health Clinic',
        contactInfo: {
          phone: '(415) 555-0654',
          email: 'maternal@sfwomenshealth.org',
          website: 'https://sfwomenshealth.org/maternal'
        },
        schedule: 'By appointment, Monday-Friday 8 AM - 6 PM',
        category: 'Women\'s Health'
      }
    ]

    // Filter programs based on location if specific location is provided
    if (location && location.toLowerCase() !== 'san francisco') {
      // In a real implementation, this would filter by actual location
      return programs.slice(0, 2) // Return fewer programs for other locations
    }

    return programs
  }
}

export const openFDAService = new OpenFDAService()
