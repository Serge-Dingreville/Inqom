describe(`after visiting ["www.welcometothejungle.com/fr/me/settings/account"] webpage, clicking on ["Se connecter"] button, filling ["Email", "Mot de passe"] inputs, clicking ["Se connecter"] button, filling ["Photo de profil"] input and clicking on ["OK"] button`, () => {
  let getUsersMe1, getUsersMe2
  before(() => {
    cy.clearLocalStorage("wttj_alerts_token").clearCookie("csrf-token")

    cy.visit('fr/me/settings/account')
    
    cy.fixture("ids/data.json").then(a =>{

      cy.get("[id='email_login']").type(a.email)

      cy.get("[id='password']").type(a.password)
    })

    cy.intercept({
      method: 'POST',
      url: '**/sessions'
    }).as("postSessions")
    cy.get("[data-testid='login-button-submit']").click().wait("@postSessions")

    cy.intercept({
      method: 'GET',
      url: '**/users/me'
    }).as("getUsersMe1")
    cy.visit('fr/me/settings/account').wait("@getUsersMe1").then(a =>{
      getUsersMe1 = a["response"]["body"]
    })

    cy.get("[name='avatar'][type='file']").selectFile({
      contents: "cypress/fixtures/img/inqom.png",
      fileName: Date.now(),
      mimeType: 'image/png'
    },{
      force:true
    })

    cy.intercept("PUT", "https://api.welcometothejungle.com/api/v1/registrations").as("putRegistrations")
    cy.get("[data-testid='account-edit-button-submit']").click().wait("@putRegistrations")

    cy.intercept({
      method: 'GET',
      url: '**/users/me'
    }).as("getUsersMe2")
    cy.visit('fr/me/settings/account').wait("@getUsersMe2").then(a =>{
      getUsersMe2 = a["response"]["body"]
    })


  })
  it("_profile-avatar data are updated", () => {
    const photoAvatar1 = getUsersMe1["user"]["avatar"]["small"]["url"]
    const photoAvatar2 = getUsersMe2["user"]["avatar"]["small"]["url"]
    expect(photoAvatar2).to.have.length
    expect(photoAvatar1).to.not.eq(photoAvatar2)

    cy.get("[id='avatar']").find("img").then(img => {
      const photoAvatar2Front = img[0]["src"]
      expect(photoAvatar2).to.eq(photoAvatar2Front)
    })
  })
})