var setTheme = localStorage.getItem('theme')
		console.log('theme:', setTheme)

		if (setTheme == null){
			swapStyle('light.css')
		}else{
			swapStyle(setTheme)
		}

		function swapStyle(sheet){
			document.getElementById('mystylesheet').href = sheet
			localStorage.setItem('theme', sheet)
		}		
		/*---------------------------------------------------------------*/
		function openNav() {
			document.getElementById("mySidenav").style.width = "250px";
			document.getElementById("main").style.marginLeft = "250px";
		  }
		  
		  function closeNav() {
			document.getElementById("mySidenav").style.width = "0";
			document.getElementById("main").style.marginLeft= "0";
		  }
		/*---------------------------------------------------------------*/
		function myFunction() {
			var input, filter, table, tr, td, i, txtValue;
			input = document.getElementById("myInput");
			filter = input.value.toUpperCase();
			table = document.getElementById("myTable");
			tr = table.getElementsByTagName("tr");
			for (i = 0; i < tr.length; i++) {
			  td = tr[i].getElementsByTagName("td")[0];
			  if (td) {
				txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
				  tr[i].style.display = "";
				} else {
				  tr[i].style.display = "none";
				}
			  }       
			}
		  }  