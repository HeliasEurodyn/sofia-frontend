﻿
![](md-images/logo.png)

Revolutionize the way you create applications with our highly sophisticated platform! Our innovative tool allows you to easily and quickly create applications that perfectly meet your business needs, all while enjoying extreme levels of customization.

With our dynamic customization options, you can tweak every aspect of your application - from database schemas to users, menus, forms, lists, access controls, reports, charts, and dashboards. And with our Access control feature, you can configure resource access per user role, ensuring your data is always secure and that your team members only see what they need to see.

But that's not all - our platform also comes with a rich UI that's tailor-made for the mobile generation of users. Whether you're using a phone or a tablet, you'll enjoy a seamless mobile experience that requires little to no training.

Ready to take your business to the next level? Try our platform today and see the difference for yourself!
![](md-images/a.png)

SOFIA comprises 2 applications: The **Author Application** which is used to dynamically configure the presentation of the data, the menus, graphs, and user access and the WebApplication which visualizes the data in various configurations and graphics. It is built on **JAVA Springboot**, **Angular**, **Redis**, **Mysql** Databases and **Docker** technologies.  

####
#### **Author’s Application** 
The ‘Author’s Application‘ is used to dynamically configure the entire application by logically separating the configuration functionalities in five layers starting from the bottom layer, database schema design to the top layer, users and roles.


![](md-images/b.png)

##
##Let’s have a look at a ‘hello world’ example application: Invoicing for a retail shop.** 

**Layer 1: Table Designer**. The first step is to create the **product, invoice** & **Customer** database tables from the **Table Designer** section of the **Author’s application**, thus, the **Invoicing component** is consisted from those 3 tables.

![](md-images/c.png)

**Layer 2:** **Component Designer**. Then the **Invoice Component** is created, using the **Component Designer** section of the **Author’s application**. Each component has a group of Tables and Views  linked together in a logical way representing the business logic parts of your application so in our case the **Invoice Component** represents the logical linking of the **Product**, **Customer**, **Invoice** tables.

![](md-images/f.png)

**Layer 3:** **Form  Designer**. The **Invoicing forms** are created in conjuction with the **Invoicing component** from the **Form  Designer** of the **Author’s application.** The forms also define how the data will be presented, configured by the **graphical interface** of the form whereby all the **functionalities** for the **data entry** and the **user rights** to each of them can be adjusted**.**  Also** custom **Css** and **Javascript** scripts can be applied here.

![](md-images/g.png)

**Layer 3: List Designer**. The **Invoicing Lists** are created in conjuction with the **Invoicing component** from the **List Designer** of the **Author’s application**. The lists define a way of searching the data and a linking point to opening the forms for editing an old data entry. In our case we can create a list of history invoices with a linking button to a form for editing a selected invoice. In this section we can apply **dynamic filters**, **user rights**, custom **Css** and **Javascript** scripts.

![](md-images/h.png)

**Layer 4: Menu Designer**. The **menus** are created from the **Menu Designer** of the **Author’s application.** A menu defines all the **sidebar** and **header menu** buttons and functionalities** for navigation on the **End User’s Application**. We can create multilanguage menu options tree with custom descriptions and Icons with a robust navigation system that allows to navigate to any part of the application. Finally we can achieve access polymorphism since we can assign different sidebar & header menus to each user, thus, different access options.

![](md-images/i.png)

SOFIA also offers functionalities for statistics, **charts** & **dashboards**, configurable **data imports** from excel files, **dynamic reports** for exporting pdf, word & html documents and many more. 

![](md-images/j.png)

